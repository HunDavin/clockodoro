import { useState, useEffect } from "react";
import "../css/report.css";

export default function Report({ visible, onClose }) {
  const [view, setView] = useState("Daily"); // "Daily", "Weekly", "Monthly"
  
  // Sample data - in a real app this would be calculated from actual usage
  const focusTime = {
    daily: { hours: 2, minutes: 35, seconds: 45 },
    weekly: { hours: 14, minutes: 22, seconds: 10 },
    monthly: { hours: 58, minutes: 45, seconds: 30 }
  };
  
  // Calculate which data to show based on current view
  const currentData = view === "Daily" 
    ? focusTime.daily 
    : view === "Weekly" 
      ? focusTime.weekly 
      : focusTime.monthly;

  if (!visible) return null;

  return (
    <>
      <div className="popup-overlay active"></div>
      <div className="report-popup">
        <div className="report-header">
          <h2>Charts</h2>
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
        </div>
      </div>
    </>
  );
}