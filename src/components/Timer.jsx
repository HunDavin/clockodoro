import { useEffect, useState, useRef } from "react";
import clockIcon from "../assets/Clockicon.png";
// Import your audio files
import tickSound from "../assets/tick.mp3";
import alarmSound from "../assets/alarm.mp3";
// Import the components
import TimerCompletedPopup from "./TimerCompletedPopup";
import SaveSessionConfirmPopup from "./SaveSessionConfirmPopup";

export default function Timer({ modeData, onModeChange }) {
  const [activeMode, setActiveMode] = useState(modeData[0]);
  const [timeLeft, setTimeLeft] = useState(activeMode.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  // Track the original duration and elapsed time
  const [originalDuration, setOriginalDuration] = useState(activeMode.minutes * 60);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // References for audio elements
  const tickingRef = useRef(new Audio(tickSound));
  const alarmRef = useRef(new Audio(alarmSound));
  
  // Add state for popups
  const [showTimerCompletedPopup, setShowTimerCompletedPopup] = useState(false);
  const [showSaveSessionPopup, setShowSaveSessionPopup] = useState(false);
  
  // Track the number of completed focus sessions
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  // Track if a focus session was just completed but not yet confirmed
  const [pendingFocusCompletion, setPendingFocusCompletion] = useState(false);
  
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
  
  // Add auto-start settings
  const [autoStartBreak, setAutoStartBreak] = useState(() => {
    return localStorage.getItem("autoStartBreak") === "true";
  });
  
  const [autoStartFocus, setAutoStartFocus] = useState(() => {
    return localStorage.getItem("autoStartFocus") === "true";
  });
  
  // Get the long break interval from localStorage or use default (4)
  const [longBreakInterval, setLongBreakInterval] = useState(() => {
    return localStorage.getItem("longBreakInterval") ? 
      parseInt(localStorage.getItem("longBreakInterval")) : 
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
      setOriginalDuration(currentMode.minutes * 60);
      setElapsedTime(0);
    }
  }, [modeData, activeMode.mode]);
  
  // Update volume and settings when they change
  useEffect(() => {
    tickingRef.current.volume = tickingVolume;
    alarmRef.current.volume = alarmVolume;
    
    // Load settings from localStorage
    const handleStorageChange = () => {
      const newTickingVolume = localStorage.getItem("tickingVolume") ?
        parseInt(localStorage.getItem("tickingVolume")) / 100 : 0.5;
      const newAlarmVolume = localStorage.getItem("alarmVolume") ?
        parseInt(localStorage.getItem("alarmVolume")) / 100 : 0.5;
      const newAlarmRepeats = localStorage.getItem("alarmRepeats") ?
        parseInt(localStorage.getItem("alarmRepeats")) : 4;
      const newLongBreakInterval = localStorage.getItem("longBreakInterval") ?
        parseInt(localStorage.getItem("longBreakInterval")) : 4;
      const newAutoStartBreak = localStorage.getItem("autoStartBreak") === "true";
      const newAutoStartFocus = localStorage.getItem("autoStartFocus") === "true";
      
      setTickingVolume(newTickingVolume);
      setAlarmVolume(newAlarmVolume);
      setAlarmRepeats(newAlarmRepeats);
      setLongBreakInterval(newLongBreakInterval);
      setAutoStartBreak(newAutoStartBreak);
      setAutoStartFocus(newAutoStartFocus);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
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
          
          // Calculate elapsed time (it's the full duration when completed)
          const totalElapsed = originalDuration;
          setElapsedTime(totalElapsed);
          
          // Play alarm sound when timer ends
          if (alarmVolume > 0) {
            playAlarmWithRepeats(alarmRepeats);
          }
          
          // If focus timer ended
          if (activeMode.mode === "Focus") {
            // For auto-start mode, increment the counter immediately
            if (autoStartBreak) {
              setCompletedFocusSessions(prev => prev + 1);
              saveCompletedSession(activeMode.mode, totalElapsed);
              handleAutoStartNextTimer();
            } else {
              // For manual mode, mark as pending but don't increment yet
              setPendingFocusCompletion(true);
              saveCompletedSession(activeMode.mode, totalElapsed);
              setShowTimerCompletedPopup(true);
            }
          } else if ((activeMode.mode === "Short Break" || activeMode.mode === "Long Break") && autoStartFocus) {
            // Auto start focus - don't show popup, start focus immediately
            handleAutoStartNextTimer();
          } else {
            // No auto-start enabled, show the timer completed popup
            setShowTimerCompletedPopup(true);
          }
          
          return 0;
        }
        
        // Update elapsed time as the timer runs
        setElapsedTime(e => e + 1);
        
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(tickingTimeout);
      tickingRef.current.pause();
    };
  }, [isRunning, originalDuration, tickingVolume, alarmVolume, alarmRepeats, activeMode.mode, autoStartBreak, autoStartFocus]);
  
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

  // Update parent component when active mode changes
  useEffect(() => {
    const index = modeData.findIndex(m => m.mode === activeMode.mode);
    if (index !== -1) {
      onModeChange(index);
    }
  }, [activeMode, modeData, onModeChange]);

  // Function to determine which break type to use based on the completed sessions
  const getNextBreakType = () => {
    // If we've completed the required number of focus sessions, it's time for a long break
    if (completedFocusSessions > 0 && completedFocusSessions % longBreakInterval === 0) {
      return "Long Break";
    } else {
      return "Short Break";
    }
  };

  // Function to save completed or partial session
  const saveCompletedSession = (mode, durationInSeconds) => {
    if (mode === "Focus") {
      // Get existing sessions from localStorage or initialize empty array
      const existingSessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
      
      // Create new session object
      const newSession = {
        startTime: new Date().getTime() - (durationInSeconds * 1000), // Calculate when the session started
        endTime: new Date().getTime(),
        duration: durationInSeconds,
        completed: durationInSeconds === originalDuration // Mark as completed only if full duration
      };
      
      // Add to existing sessions
      existingSessions.push(newSession);
      
      // Save back to localStorage
      localStorage.setItem('focusSessions', JSON.stringify(existingSessions));
    }
  };

  // Function to handle automatic timer switching when auto-start is enabled
  const handleAutoStartNextTimer = () => {
    stopAlarmPlayback();
    
    // Determine which mode to switch to
    let nextModeIndex;
    
    if (activeMode.mode === "Focus") {
      // After Focus, determine if we should go to Short Break or Long Break
      const nextBreakType = getNextBreakType();
      
      // Reset counter right before long break starts
      if (nextBreakType === "Long Break") {
        setCompletedFocusSessions(0);
      }
      
      nextModeIndex = modeData.findIndex(m => m.mode === nextBreakType);
    } else {
      // After any break, go to Focus
      nextModeIndex = modeData.findIndex(m => m.mode === "Focus");
    }
    
    if (nextModeIndex !== -1) {
      // Set the new active mode and reset the timer
      const nextMode = modeData[nextModeIndex];
      setActiveMode(nextMode);
      setTimeLeft(nextMode.minutes * 60);
      setOriginalDuration(nextMode.minutes * 60);
      setElapsedTime(0);
      setPendingFocusCompletion(false); // Clear any pending completion state
      
      // Important: Add a small delay before starting the timer
      // This ensures state updates have completed
      setTimeout(() => {
        setIsRunning(true);
      }, 100);
    }
  };

  // Function to handle starting the next timer manually
  const handleStartNext = () => {
    stopAlarmPlayback();
    
    // If there was a pending focus completion, now is the time to update the counter
    if (pendingFocusCompletion) {
      setCompletedFocusSessions(prev => prev + 1);
      setPendingFocusCompletion(false);
    }
    
    // Determine which mode to switch to
    let nextModeIndex;
    
    if (activeMode.mode === "Focus") {
      // After Focus, determine if we should go to Short Break or Long Break
      const nextBreakType = getNextBreakType();
      
      // *** IMPORTANT FIX: Reset counter right before long break starts ***
      if (nextBreakType === "Long Break") {
        setCompletedFocusSessions(0);
      }
      
      nextModeIndex = modeData.findIndex(m => m.mode === nextBreakType);
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
      setOriginalDuration(nextMode.minutes * 60);
      setElapsedTime(0);
      
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
    setPendingFocusCompletion(false); // Clear pending state if user stops
    setShowTimerCompletedPopup(false);
    // Timer is already stopped, just close the popup
  };

  // Function to manually toggle the timer
  const toggleTimer = () => {
    if (isRunning) {
      // Pausing the timer - only show confirmation popup if in Focus mode
      // and some time has elapsed (greater than 10 seconds for a meaningful session)
      if (activeMode.mode === "Focus" && elapsedTime > 0) {
        setIsRunning(false);
        setShowSaveSessionPopup(true);
      } else {
        setIsRunning(false);
      }
    } else {
      // Starting the timer
      setElapsedTime(0);
      setIsRunning(true);
    }
  };

  // Handlers for save session popup
  const handleSaveSession = () => {
    // Save the partial session
    saveCompletedSession(activeMode.mode, elapsedTime);
    setShowSaveSessionPopup(false);
  };

  const handleDiscardSession = () => {
    // Just close the popup without saving
    setShowSaveSessionPopup(false);
  };

  // Function to handle mode selection
  const handleModeSelect = (mode) => {
    // If we're changing modes while a Focus timer is running,
    // ask if the user wants to save their progress
    if (isRunning && activeMode.mode === "Focus" && mode.mode !== "Focus" && elapsedTime > 0) {
      setIsRunning(false);
      setShowSaveSessionPopup(true);
      // Store the mode to switch to after deciding whether to save
      sessionStorage.setItem('pendingMode', JSON.stringify(mode));
    } else {
      // Direct mode change
      
      // If manually switching to Long Break, also reset the counter
      if (mode.mode === "Long Break") {
        setCompletedFocusSessions(0);
      }
      
      setActiveMode(mode);
      setTimeLeft(mode.minutes * 60);
      setOriginalDuration(mode.minutes * 60);
      setElapsedTime(0);
      setIsRunning(false);
      setPendingFocusCompletion(false); // Clear any pending completion state
    }
  };

  // Check if current mode is a break mode
  const isBreakMode = activeMode.mode === "Short Break" || activeMode.mode === "Long Break";

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
      {/* Display the number of completed focus sessions with dynamic color */}
      <div className="focus-sessions-info" style={{ color: isBreakMode ? "rgba(255, 255, 255, 0.9)" : "" }}>
        <span>Session {completedFocusSessions} of {longBreakInterval}</span>
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
      
      {/* Timer completed popup */}
      <TimerCompletedPopup 
        visible={showTimerCompletedPopup} 
        onClose={() => {
          stopAlarmPlayback();
          setShowTimerCompletedPopup(false);
          setPendingFocusCompletion(false); // Clear pending state if user closes popup
        }}
        mode={activeMode.mode}
        onStartNext={handleStartNext}
        onStop={handleStop}
        nextBreakType={activeMode.mode === "Focus" ? getNextBreakType() : null}
      />
      
      {/* Save session popup when pausing */}
      <SaveSessionConfirmPopup
        visible={showSaveSessionPopup}
        elapsedTime={elapsedTime}
        onSave={handleSaveSession}
        onDiscard={handleDiscardSession}
      />
    </main>
  );
}