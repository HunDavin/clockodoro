export default function TimerCompletedPopup({ visible, onClose, mode, onStartNext, onStop, nextBreakType }) {
  if (!visible) return null;

  // Determine the next mode and button text based on current mode
  const isBreakTimer = mode === "Short Break" || mode === "Long Break";
  const nextModeName = isBreakTimer ? "Focus" : nextBreakType || "Break";
  const messageText = isBreakTimer ? "Break time is up!" : "Focus time is up!";

  return (
    <>
      {/* Added overlay div similar to the one in Report.jsx */}
      <div className="popup-overlay active"></div>
      <div className="timer-completed-popup">
        <div className="timer-completed-content" style={{ backgroundColor: isBreakTimer ? "#4CAF50" : "#FF5C5C" }}>
          <div className="timer-completed-icon" style={{ color: isBreakTimer ? "#4CAF50" : "#FF5C5C" }}>
            {isBreakTimer ? "⏰" : "✓"}
          </div>
          <div className="timer-completed-message">
            <p className="timer-completed-title">{messageText}</p>
            <p className="timer-completed-name">What would you like to do next?</p>
          </div>
          <div className="timer-completed-actions">
            <button 
              className="timer-completed-action-btn continue" 
              onClick={onStartNext}
            >
              Start {nextModeName}
            </button>
            <button 
              className="timer-completed-action-btn stop" 
              onClick={onStop}
            >
              Stop
            </button>
          </div>
          <button className="timer-completed-close" onClick={onClose}>×</button>
        </div>
      </div>
    </>
  );
}