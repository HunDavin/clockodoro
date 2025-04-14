import { useEffect, useState } from "react";

export default function Timer({ modeData, onModeChange }) {
  const [activeMode, setActiveMode] = useState(modeData[0]);
  const [timeLeft, setTimeLeft] = useState(activeMode.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatTime = (value) => (value < 10 ? `0${value}` : value);
  
  // Update timer when active mode changes
  useEffect(() => {
    const currentMode = modeData.find(m => m.mode === activeMode.mode);
    if (currentMode) {
      setActiveMode(currentMode);
      setTimeLeft(currentMode.minutes * 60);
      setIsRunning(false);
    }
  }, [modeData, activeMode.mode]);
  
  // Handle timer countdown
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRunning]);
  
  // Update active mode index for background color change
  useEffect(() => {
    const index = modeData.findIndex(m => m.mode === activeMode.mode);
    if (index !== -1) {
      onModeChange(index);
    }
  }, [activeMode, modeData, onModeChange]);
  
  // Mode button component
  function ModeButton({ mode }) {
    const isActive = activeMode.mode === mode.mode;
    
    return (
      <div className={`mode-button ${isActive ? "active" : ""}`} style={{ backgroundColor: isActive ? mode.btnColor : "white", color: isActive ? "white" : "#333" }} onClick={() => setActiveMode(mode)}>
        <div className="mode-header">
          <span className="mode-name">{mode.mode}</span>
        </div>

        <div className="mode-content">
          <img className="mode-icon" src={mode.icon} alt={mode.mode} />
          <div className="mode-time-display" style={{ color: isActive ? "white" : "#333" }}>
            <span className="mode-minutes">{mode.minutes}</span>
            <span className="min-label">min</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="timer-section">
      <h2 className="timer-title">{activeMode.mode} Timer</h2>

      <div className="timer-display">
        <span className="time">{formatTime(minutes)}</span>
        <span className="separator">:</span>
        <span className="time">{formatTime(seconds)}</span>
      </div>

      <div className="clock-icons">
        <img src="/src/assets/Clockicon.png" alt="clockIcon" className="clock-icon" />
        <img src="/src/assets/Clockicon.png" alt="clockIcon" className="clock-icon" />
        <img src="/src/assets/Clockicon.png" alt="clockIcon" className="clock-icon" />
        <img src="/src/assets/Clockicon.png" alt="clockIcon" className="clock-icon" />
      </div>
      
      <div className="controls-container">
        {modeData.map((mode) => (
          <ModeButton key={mode.id} mode={mode} />
        ))}
        
        <div className="start-button" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "PAUSE" : "START"}
        </div>
      </div>
    </main>
  );
}