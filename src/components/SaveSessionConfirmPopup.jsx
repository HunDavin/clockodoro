import React from "react";

export default function SaveSessionConfirmPopup({ visible, onSave, onDiscard, elapsedTime }) {
  if (!visible) return null;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    let timeString = "";
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0 || hours > 0) timeString += `${minutes}m `;
    timeString += `${remainingSeconds}s`;
    
    return timeString;
  };

  return (
    <>
      <div className="popup-overlay active"></div>
      <div className="save-session-popup">
        <div className="popup-header">
          <h2>Save Focus Session?</h2>
          <button className="close-button-save" onClick={onDiscard}>×</button>
        </div>
        
        <div className="popup-content">
          <p>You've paused after focusing for {formatTime(elapsedTime)}.</p>
          <p>Would you like to save this time to your focus statistics?</p>
          
          <div className="popup-actions">
            <button className="discard-button" onClick={onDiscard}>
              Don't Save
            </button>
            <button className="save-button" onClick={onSave}>
              Save Session
            </button>
          </div>
        </div>
      </div>
    </>
  );
}