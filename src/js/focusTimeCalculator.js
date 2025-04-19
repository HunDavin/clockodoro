export function getAllFocusSessions() {
  return JSON.parse(localStorage.getItem('focusSessions') || '[]');
}

function filterSessionsByDateRange(sessions, startDate, endDate) {
  return sessions.filter(session => {
    const sessionDate = new Date(session.endTime);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
}

export function getDailyFocusSessions() {
  const sessions = getAllFocusSessions();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return filterSessionsByDateRange(sessions, today, tomorrow);
}

export function getWeeklyFocusSessions() {
  const sessions = getAllFocusSessions();
  const today = new Date();
  const firstDay = new Date(today);
  const day = today.getDay();
  
  const diff = day === 0 ? 0 : day;
  firstDay.setDate(today.getDate() - diff);
  firstDay.setHours(0, 0, 0, 0);
  
  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 6);
  lastDay.setHours(23, 59, 59, 999);
  
  return filterSessionsByDateRange(sessions, firstDay, lastDay);
}

export function getMonthlyFocusSessions() {
  const sessions = getAllFocusSessions();
  const today = new Date();
  
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  firstDay.setHours(0, 0, 0, 0);
  
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  lastDay.setHours(23, 59, 59, 999);
  
  return filterSessionsByDateRange(sessions, firstDay, lastDay);
}

export function calculateTotalTime(sessions) {
  const totalSeconds = sessions.reduce((total, session) => {
    return total + session.duration;
  }, 0);
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return { hours, minutes, seconds };
}

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

export function resetFocusTimeData(timeframe) {
  try {
    const allSessions = getAllFocusSessions();
    let sessionsToKeep = [];
    
    if (timeframe === "all") {
      localStorage.setItem('focusSessions', JSON.stringify([]));
      return true;
    }
    
    if (timeframe === "daily") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      sessionsToKeep = allSessions.filter(session => {
        const sessionDate = new Date(session.endTime);
        return sessionDate < today;
      });
    } 
    else if (timeframe === "weekly") {
      const today = new Date();
      const firstDayOfWeek = new Date(today);
      const day = today.getDay();
      
      const diff = day === 0 ? 0 : day;
      firstDayOfWeek.setDate(today.getDate() - diff);
      firstDayOfWeek.setHours(0, 0, 0, 0);
      
      sessionsToKeep = allSessions.filter(session => {
        const sessionDate = new Date(session.endTime);
        return sessionDate < firstDayOfWeek;
      });
    } 
    else if (timeframe === "monthly") {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      firstDayOfMonth.setHours(0, 0, 0, 0);
      
      sessionsToKeep = allSessions.filter(session => {
        const sessionDate = new Date(session.endTime);
        return sessionDate < firstDayOfMonth;
      });
    }
    
    localStorage.setItem('focusSessions', JSON.stringify(sessionsToKeep));
    return true;
  } catch (error) {
    console.error("Error resetting focus time data:", error);
    return false;
  }
}