import { useState, useEffect } from "react";
import "../css/report.css";
import { getFocusTimeStats, resetFocusTimeData } from "../js/focusTimeCalculator";

export default function Report({ visible, onClose }) {
  const [view, setView] = useState("Daily");
  const [focusTime, setFocusTime] = useState({
    daily: { hours: 0, minutes: 0, seconds: 0 },
    weekly: { hours: 0, minutes: 0, seconds: 0 },
    monthly: { hours: 0, minutes: 0, seconds: 0 }
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  useEffect(() => {
    if (visible) {
      loadStats();
    }
  }, [visible]);
  
  const loadStats = () => {
    const stats = getFocusTimeStats();
    setFocusTime(stats);
  };
  
  const currentData = view === "Daily" 
    ? focusTime.daily 
    : view === "Weekly" 
      ? focusTime.weekly 
      : focusTime.monthly;

  const handleReset = () => {
    setShowResetConfirm(true);
  };
  
  const confirmReset = () => {
    const timeframe = view.toLowerCase();
    const success = resetFocusTimeData(timeframe);
    
    if (success) {
      loadStats();
      setShowResetConfirm(false);
    } else {
      alert("Failed to reset data. Please try again.");
    }
  };
  
  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="popup-overlay active"></div>
      <div className="report-popup">
        <div className="report-header">
          <h2>Focus Time Report</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="report-tabs">
          <button 
            className={`report-tab ${view === "Daily" ? "active" : ""}`} 
            onClick={() => setView("Daily")}
          >
            Daily
          </button>
          <button 
            className={`report-tab ${view === "Weekly" ? "active" : ""}`} 
            onClick={() => setView("Weekly")}
          >
            Weekly
          </button>
          <button 
            className={`report-tab ${view === "Monthly" ? "active" : ""}`} 
            onClick={() => setView("Monthly")}
          >
            Monthly
          </button>
        </div>
        
        <div className="report-content">
          <h3>{view} overview</h3>
          
          <div className="report-focus-card">
            <div className="report-focus-title">Focus</div>
            <div className="report-focus-time">
              {currentData.hours}h {currentData.minutes}m
            </div>
            
            <div className="report-metrics">
              <div className="report-metric">
                <span className="report-metric-value">{currentData.hours}</span>
                <span className="report-metric-label">Hours</span>
              </div>
              <div className="report-metric">
                <span className="report-metric-value">{currentData.minutes}m</span>
                <span className="report-metric-label">Minutes</span>
              </div>
              <div className="report-metric">
                <span className="report-metric-value">{currentData.seconds}s</span>
                <span className="report-metric-label">Seconds</span>
              </div>
            </div>
          </div>
          <div className="report-actions">
            <button className="reset-button" onClick={handleReset}>
              Reset Data
            </button>
          </div>
        </div>
        
        {showResetConfirm && (
          <div className="reset-confirm-popup">
            <div className="reset-confirm-content">
              <h3>Reset Data?</h3>
              <p>Are you sure you want to reset all focus time data? This cannot be undone.</p>
              <div className="reset-confirm-actions">
                <button className="cancel-button" onClick={cancelReset}>Cancel</button>
                <button className="confirm-button" onClick={confirmReset}>Reset</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}