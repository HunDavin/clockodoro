// src/js/focusTimeCalculator.js

/**
 * Get all saved focus sessions from localStorage
 */
export function getAllFocusSessions() {
  return JSON.parse(localStorage.getItem('focusSessions') || '[]');
}

/**
 * Filter sessions by date range
 * @param {Array} sessions - All focus sessions
 * @param {Date} startDate - Start date of the range
 * @param {Date} endDate - End date of the range
 * @returns {Array} Filtered sessions
 */
function filterSessionsByDateRange(sessions, startDate, endDate) {
  return sessions.filter(session => {
    const sessionDate = new Date(session.endTime);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
}

/**
 * Get focus sessions for today
 */
export function getDailyFocusSessions() {
  const sessions = getAllFocusSessions();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return filterSessionsByDateRange(sessions, today, tomorrow);
}

/**
 * Get focus sessions for current week
 */
export function getWeeklyFocusSessions() {
  const sessions = getAllFocusSessions();
  const today = new Date();
  const firstDay = new Date(today);
  const day = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Set to previous Sunday (or today if it's Sunday)
  const diff = day === 0 ? 0 : day;
  firstDay.setDate(today.getDate() - diff);
  firstDay.setHours(0, 0, 0, 0);
  
  // Set to next Saturday
  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 6);
  lastDay.setHours(23, 59, 59, 999);
  
  return filterSessionsByDateRange(sessions, firstDay, lastDay);
}

/**
 * Get focus sessions for current month
 */
export function getMonthlyFocusSessions() {
  const sessions = getAllFocusSessions();
  const today = new Date();
  
  // First day of current month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  firstDay.setHours(0, 0, 0, 0);
  
  // Last day of current month
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  lastDay.setHours(23, 59, 59, 999);
  
  return filterSessionsByDateRange(sessions, firstDay, lastDay);
}

/**
 * Calculate total duration from sessions
 * @param {Array} sessions - Focus sessions
 * @returns {Object} Total time in hours, minutes, seconds
 */
export function calculateTotalTime(sessions) {
  // Sum up all durations
  const totalSeconds = sessions.reduce((total, session) => {
    return total + session.duration;
  }, 0);
  
  // Convert to hours, minutes, seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return { hours, minutes, seconds };
}

/**
 * Get daily, weekly and monthly focus time stats
 * @returns {Object} Object containing daily, weekly and monthly stats
 */
export function getFocusTimeStats() {
  const dailySessions = getDailyFocusSessions();
  const weeklySessions = getWeeklyFocusSessions();
  const monthlySessions = getMonthlyFocusSessions();
  
  return {
    daily: calculateTotalTime(dailySessions),
    weekly: calculateTotalTime(weeklySessions),
    monthly: calculateTotalTime(monthlySessions)
  };
}

/**
 * Reset focus time data
 * @param {string} timeframe - "daily", "weekly", "monthly", or "all"
 * @returns {boolean} Success status
 */
export function resetFocusTimeData(timeframe) {
  try {
    const allSessions = getAllFocusSessions();
    let sessionsToKeep = [];
    
    if (timeframe === "all") {
      // Reset all data
      localStorage.setItem('focusSessions', JSON.stringify([]));
      return true;
    }
    
    // Filter out sessions based on timeframe
    if (timeframe === "daily") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Keep sessions that are not from today
      sessionsToKeep = allSessions.filter(session => {
        const sessionDate = new Date(session.endTime);
        return sessionDate < today;
      });
    } 
    else if (timeframe === "weekly") {
      const today = new Date();
      const firstDayOfWeek = new Date(today);
      const day = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Set to previous Sunday (or today if it's Sunday)
      const diff = day === 0 ? 0 : day;
      firstDayOfWeek.setDate(today.getDate() - diff);
      firstDayOfWeek.setHours(0, 0, 0, 0);
      
      // Keep sessions that are not from this week
      sessionsToKeep = allSessions.filter(session => {
        const sessionDate = new Date(session.endTime);
        return sessionDate < firstDayOfWeek;
      });
    } 
    else if (timeframe === "monthly") {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      firstDayOfMonth.setHours(0, 0, 0, 0);
      
      // Keep sessions that are not from this month
      sessionsToKeep = allSessions.filter(session => {
        const sessionDate = new Date(session.endTime);
        return sessionDate < firstDayOfMonth;
      });
    }
    
    // Save the filtered sessions back to localStorage
    localStorage.setItem('focusSessions', JSON.stringify(sessionsToKeep));
    return true;
  } catch (error) {
    console.error("Error resetting focus time data:", error);
    return false;
  }
}