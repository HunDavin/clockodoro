import { useEffect, useState, useRef } from "react";
import clockIcon from "../assets/Clockicon.png";
// Import your audio files
import tickSound from "../assets/tick.mp3";
import alarmSound from "../assets/alarm.mp3";
// Import the new TimerCompletedPopup component
import TimerCompletedPopup from "./TimerCompletedPopup";

export default function Timer({ modeData, onModeChange }) {
  const [activeMode, setActiveMode] = useState(modeData[0]);
  const [timeLeft, setTimeLeft] = useState(activeMode.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  // References for audio elements
  const tickingRef = useRef(new Audio(tickSound));
  const alarmRef = useRef(new Audio(alarmSound));
  // Add state for timer completion popup
  const [showTimerCompletedPopup, setShowTimerCompletedPopup] = useState(false);
  
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
    let tickingTimeout;
    if (tickingVolume > 0) {
      tickingTimeout = setTimeout(() => {
        tickingRef.current.loop = true;
        tickingRef.current.play().catch(e => console.log("Audio play failed:", e));
      }, 500);
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
          
          // Show the timer completed popup instead of just resetting
          setShowTimerCompletedPopup(true);
          
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
  
  let playAlarm; // Declare outside so it can be referenced globally

  const playAlarmWithRepeats = (repeats) => {
    let count = 0;

    playAlarm = () => {
      if (count < repeats) {
        alarmRef.current.currentTime = 0;
        alarmRef.current.play().catch(e => console.log("Alarm play failed:", e));
        count++;
      } else {
        alarmRef.current.removeEventListener('ended', playAlarm);
      }
    };

    alarmRef.current.addEventListener('ended', playAlarm);
    playAlarm(); // Start the first alarm
  };

  const stopAlarmPlayback = () => {
    alarmRef.current.pause();
    alarmRef.current.currentTime = 0;
    if (playAlarm) {
      alarmRef.current.removeEventListener('ended', playAlarm);
    }
  };

  
  useEffect(() => {
    const index = modeData.findIndex(m => m.mode === activeMode.mode);
    if (index !== -1) {
      onModeChange(index);
    }
  }, [activeMode, modeData, onModeChange]);

  // Function to handle starting the next timer
  const handleStartNext = () => {
    stopAlarmPlayback();
    // Determine which mode to switch to
    let nextModeIndex;
    if (activeMode.mode === "Focus") {
      // After Focus, go to Short Break
      nextModeIndex = modeData.findIndex(m => m.mode === "Short Break");
    } else {
      // After any break, go to Focus
      nextModeIndex = modeData.findIndex(m => m.mode === "Focus");
    }
    
    if (nextModeIndex !== -1) {
      // First close the popup
      setShowTimerCompletedPopup(false);
      
      // Set the new active mode and reset the timer
      const nextMode = modeData[nextModeIndex];
      setActiveMode(nextMode);
      setTimeLeft(nextMode.minutes * 60);
      
      // Important: Add a small delay before starting the timer
      // This ensures state updates have completed
      setTimeout(() => {
        setIsRunning(true);
      }, 100);
    }
  };

  // Function to handle stopping the timer
  const handleStop = () => {
    stopAlarmPlayback();
    setShowTimerCompletedPopup(false);
    // Timer is already stopped, just close the popup
  };

  // Function to manually toggle the timer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Function to handle mode selection
  const handleModeSelect = (mode) => {
    setActiveMode(mode);
    setTimeLeft(mode.minutes * 60);
    setIsRunning(false);
  };

  

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
            <div 
              key={mode.id} 
              className={`mode-button ${isActive ? "active" : ""}`} 
              style={{ 
                backgroundColor: isActive ? mode.btnColor : "white", 
                color: isActive ? "white" : "#333" 
              }} 
              onClick={() => handleModeSelect(mode)}
            >
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
        <div className="start-button" onClick={toggleTimer}>
          {isRunning ? "PAUSE" : "START"}
        </div>
      </div>
      
      {/* Add the timer completed popup */}
      <TimerCompletedPopup 
        visible={showTimerCompletedPopup} 
        onClose={() => {
          stopAlarmPlayback();
          setShowTimerCompletedPopup(false);
        }}
        mode={activeMode.mode}
        onStartNext={handleStartNext}
        onStop={handleStop}
      />
    </main>
  );
}