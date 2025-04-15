import { useEffect, useState, useRef } from "react";
import clockIcon from "../assets/Clockicon.png";
// Import your audio files
import tickSound from "../assets/tick.mp3";
import alarmSound from "../assets/alarm.mp3";

export default function Timer({ modeData, onModeChange }) {
  const [activeMode, setActiveMode] = useState(modeData[0]);
  const [timeLeft, setTimeLeft] = useState(activeMode.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  // References for audio elements
  const tickingRef = useRef(new Audio(tickSound));
  const alarmRef = useRef(new Audio(alarmSound));
  // Audio settings from localStorage or defaults
  const [tickingVolume, setTickingVolume] = useState(() => {
    return localStorage.getItem("tickingVolume") ? 
      parseInt(localStorage.getItem("tickingVolume")) / 100 : 
      0.5;
  });
  const [alarmVolume, setAlarmVolume] = useState(() => {
    return localStorage.getItem("alarmVolume") ? 
      parseInt(localStorage.getItem("alarmVolume")) / 100 : 
      0.5;
  });
  const [alarmRepeats, setAlarmRepeats] = useState(() => {
    return localStorage.getItem("alarmRepeats") ? 
      parseInt(localStorage.getItem("alarmRepeats")) : 
      4;
  });
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatTime = (value) => (value < 10 ? `0${value}` : value);
  
  // Update mode when modeData changes
  useEffect(() => {
    const currentMode = modeData.find(m => m.mode === activeMode.mode);
    if (currentMode) {
      setActiveMode(currentMode);
      setTimeLeft(currentMode.minutes * 60);
      setIsRunning(false);
    }
  }, [modeData, activeMode.mode]);
  
  // Update volume when settings change
  useEffect(() => {
    tickingRef.current.volume = tickingVolume;
    alarmRef.current.volume = alarmVolume;
    
    // Load settings from localStorage
    window.addEventListener('storage', () => {
      const newTickingVolume = localStorage.getItem("tickingVolume") ?
        parseInt(localStorage.getItem("tickingVolume")) / 100 : 0.5;
      const newAlarmVolume = localStorage.getItem("alarmVolume") ?
        parseInt(localStorage.getItem("alarmVolume")) / 100 : 0.5;
      const newAlarmRepeats = localStorage.getItem("alarmRepeats") ?
        parseInt(localStorage.getItem("alarmRepeats")) : 4;
      
      setTickingVolume(newTickingVolume);
      setAlarmVolume(newAlarmVolume);
      setAlarmRepeats(newAlarmRepeats);
    });
    
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, [tickingVolume, alarmVolume]);
  
  // Timer effect with ticking sound
  useEffect(() => {
    if (!isRunning) {
      tickingRef.current.pause();
      return;
    }
    
    // Start ticking sound when timer starts
    if (tickingVolume > 0) {
      tickingRef.current.loop = true;
      tickingRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          tickingRef.current.pause();
          
          // Play alarm sound when timer ends
          if (alarmVolume > 0) {
            playAlarmWithRepeats(alarmRepeats);
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(interval);
      tickingRef.current.pause();
    };
  }, [isRunning, tickingVolume, alarmVolume, alarmRepeats]);
  
  // Play alarm with repeats
  const playAlarmWithRepeats = (repeats) => {
    let count = 0;
    
    const playAlarm = () => {
      if (count < repeats) {
        alarmRef.current.currentTime = 0;
        alarmRef.current.play().catch(e => console.log("Alarm play failed:", e));
        count++;
      } else {
        alarmRef.current.removeEventListener('ended', playAlarm);
      }
    };
    
    alarmRef.current.addEventListener('ended', playAlarm);
    playAlarm(); // Play the first time
  };
  
  useEffect(() => {
    const index = modeData.findIndex(m => m.mode === activeMode.mode);
    if (index !== -1) {
      onModeChange(index);
    }
  }, [activeMode, modeData, onModeChange]);

  return (
    <main className="timer-section">
      <h2 className="timer-title">{activeMode.mode} Timer</h2>
      <div className="timer-display">
        <span className="time">{formatTime(minutes)}</span>
        <span className="separator">:</span>
        <span className="time">{formatTime(seconds)}</span>
      </div>
      <div className="clock-icons">
        <img src={clockIcon} alt="clockIcon" className="clock-icon" />
        <img src={clockIcon} alt="clockIcon" className="clock-icon" />
        <img src={clockIcon} alt="clockIcon" className="clock-icon" />
        <img src={clockIcon} alt="clockIcon" className="clock-icon" />
      </div>
      <div className="controls-container">
        {modeData.map((mode) => {
          const isActive = activeMode.mode === mode.mode;
          return (
            <div key={mode.id} className={`mode-button ${isActive ? "active" : ""}`} style={{ backgroundColor: isActive ? mode.btnColor : "white", color: isActive ? "white" : "#333" }} onClick={() => setActiveMode(mode)}>
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
        })}
        <div className="start-button" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "PAUSE" : "START"}
        </div>
      </div>
    </main>
  );
}