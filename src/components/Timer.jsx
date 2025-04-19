import { useEffect, useState, useRef } from "react";
import clockIcon from "../assets/Clockicon.png";
import tickSound from "../assets/tick.mp3";
import alarmSound from "../assets/alarm.mp3";
import TimerCompletedPopup from "./TimerCompletedPopup";
import SaveSessionConfirmPopup from "./SaveSessionConfirmPopup";

export default function Timer({ modeData, onModeChange }) {
  const [activeMode, setActiveMode] = useState(modeData[0]);
  const [timeLeft, setTimeLeft] = useState(activeMode.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [originalDuration, setOriginalDuration] = useState(activeMode.minutes * 60);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const tickingRef = useRef(new Audio(tickSound));
  const alarmRef = useRef(new Audio(alarmSound));
  
  const [showTimerCompletedPopup, setShowTimerCompletedPopup] = useState(false);
  const [showSaveSessionPopup, setShowSaveSessionPopup] = useState(false);
  
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const [pendingFocusCompletion, setPendingFocusCompletion] = useState(false);
  
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
  
  const [autoStartBreak, setAutoStartBreak] = useState(() => {
    return localStorage.getItem("autoStartBreak") === "true";
  });
  
  const [autoStartFocus, setAutoStartFocus] = useState(() => {
    return localStorage.getItem("autoStartFocus") === "true";
  });
  
  const [longBreakInterval, setLongBreakInterval] = useState(() => {
    return localStorage.getItem("longBreakInterval") ? 
      parseInt(localStorage.getItem("longBreakInterval")) : 
      4;
  });
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatTime = (value) => (value < 10 ? `0${value}` : value);
  
  useEffect(() => {
    const currentMode = modeData.find(m => m.mode === activeMode.mode);
    if (currentMode) {
      setActiveMode(currentMode);
      setTimeLeft(currentMode.minutes * 60);
      setOriginalDuration(currentMode.minutes * 60);
      setElapsedTime(0);
    }
  }, [modeData, activeMode.mode]);
  
  useEffect(() => {
    tickingRef.current.volume = tickingVolume;
    alarmRef.current.volume = alarmVolume;
    
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
  
  useEffect(() => {
    if (!isRunning) {
      tickingRef.current.pause();
      return;
    }
    
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
          
          const totalElapsed = originalDuration;
          setElapsedTime(totalElapsed);
          
          if (alarmVolume > 0) {
            playAlarmWithRepeats(alarmRepeats);
          }
          
          if (activeMode.mode === "Focus") {
            if (autoStartBreak) {
              setCompletedFocusSessions(prev => prev + 1);
              saveCompletedSession(activeMode.mode, totalElapsed);
              handleAutoStartNextTimer();
            } else {
              setPendingFocusCompletion(true);
              saveCompletedSession(activeMode.mode, totalElapsed);
              setShowTimerCompletedPopup(true);
            }
          } else if ((activeMode.mode === "Short Break" || activeMode.mode === "Long Break") && autoStartFocus) {
            handleAutoStartNextTimer();
          } else {
            setShowTimerCompletedPopup(true);
          }
          
          return 0;
        }
        
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
  
  let playAlarm;

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
    playAlarm();
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

  const getNextBreakType = () => {
    if (completedFocusSessions > 0 && completedFocusSessions % longBreakInterval === 0) {
      return "Long Break";
    } else {
      return "Short Break";
    }
  };

  const saveCompletedSession = (mode, durationInSeconds) => {
    if (mode === "Focus") {
      const existingSessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
      
      const newSession = {
        startTime: new Date().getTime() - (durationInSeconds * 1000),
        endTime: new Date().getTime(),
        duration: durationInSeconds,
        completed: durationInSeconds === originalDuration
      };
      
      existingSessions.push(newSession);
      localStorage.setItem('focusSessions', JSON.stringify(existingSessions));
    }
  };

  const handleAutoStartNextTimer = () => {
    stopAlarmPlayback();
    
    let nextModeIndex;
    
    if (activeMode.mode === "Focus") {
      const nextBreakType = getNextBreakType();
      
      if (nextBreakType === "Long Break") {
        setCompletedFocusSessions(0);
      }
      
      nextModeIndex = modeData.findIndex(m => m.mode === nextBreakType);
    } else {
      nextModeIndex = modeData.findIndex(m => m.mode === "Focus");
    }
    
    if (nextModeIndex !== -1) {
      const nextMode = modeData[nextModeIndex];
      setActiveMode(nextMode);
      setTimeLeft(nextMode.minutes * 60);
      setOriginalDuration(nextMode.minutes * 60);
      setElapsedTime(0);
      setPendingFocusCompletion(false);
      
      setTimeout(() => {
        setIsRunning(true);
      }, 100);
    }
  };

  const handleStartNext = () => {
    stopAlarmPlayback();
    
    if (pendingFocusCompletion) {
      setCompletedFocusSessions(prev => prev + 1);
      setPendingFocusCompletion(false);
    }
    
    let nextModeIndex;
    
    if (activeMode.mode === "Focus") {
      const nextBreakType = getNextBreakType();
      
      if (nextBreakType === "Long Break") {
        setCompletedFocusSessions(0);
      }
      
      nextModeIndex = modeData.findIndex(m => m.mode === nextBreakType);
    } else {
      nextModeIndex = modeData.findIndex(m => m.mode === "Focus");
    }
    
    if (nextModeIndex !== -1) {
      setShowTimerCompletedPopup(false);
      
      const nextMode = modeData[nextModeIndex];
      setActiveMode(nextMode);
      setTimeLeft(nextMode.minutes * 60);
      setOriginalDuration(nextMode.minutes * 60);
      setElapsedTime(0);
      
      setTimeout(() => {
        setIsRunning(true);
      }, 100);
    }
  };

  const handleStop = () => {
    stopAlarmPlayback();
    
    if (pendingFocusCompletion) {
      setCompletedFocusSessions(prev => prev + 1);
      setPendingFocusCompletion(false);
    }
    
    setShowTimerCompletedPopup(false);
  };

  const toggleTimer = () => {
    if (isRunning) {
      if (activeMode.mode === "Focus" && elapsedTime > 0) {
        setIsRunning(false);
        setShowSaveSessionPopup(true);
      } else {
        setIsRunning(false);
      }
    } else {
      setElapsedTime(0);
      setIsRunning(true);
    }
  };

  const handleSaveSession = () => {
    saveCompletedSession(activeMode.mode, elapsedTime);
    setShowSaveSessionPopup(false);
  };

  const handleDiscardSession = () => {
    setShowSaveSessionPopup(false);
  };

  const handleModeSelect = (mode) => {
    if (isRunning && activeMode.mode === "Focus" && mode.mode !== "Focus" && elapsedTime > 0) {
      setIsRunning(false);
      setShowSaveSessionPopup(true);
      sessionStorage.setItem('pendingMode', JSON.stringify(mode));
    } else {
      if (mode.mode === "Long Break") {
        setCompletedFocusSessions(0);
      }
      
      setActiveMode(mode);
      setTimeLeft(mode.minutes * 60);
      setOriginalDuration(mode.minutes * 60);
      setElapsedTime(0);
      setIsRunning(false);
      setPendingFocusCompletion(false);
    }
  };

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
        {Array.from({ length: longBreakInterval }).map((_, index) => (
          <img 
            key={index}
            src={clockIcon}
            alt="session progress"
            className="clock-icon" 
            style={{ opacity: index < completedFocusSessions ? "1" : "0.4" }}
          />
        ))}
      </div>
      <div className="controls-container">
        {modeData.map((mode) => {
          const isActive = activeMode.mode === mode.mode;
          const isLongBreak = mode.mode === "Long Break";
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
                <img className={`mode-icon ${isLongBreak ? "rest-icon" : ""}`} src={mode.icon} alt={mode.mode} />
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
      
      <TimerCompletedPopup 
        visible={showTimerCompletedPopup} 
        onClose={() => {
          stopAlarmPlayback();
          setShowTimerCompletedPopup(false);
          setPendingFocusCompletion(false);
        }}
        mode={activeMode.mode}
        onStartNext={handleStartNext}
        onStop={handleStop}
        nextBreakType={activeMode.mode === "Focus" ? getNextBreakType() : null}
      />
      
      <SaveSessionConfirmPopup
        visible={showSaveSessionPopup}
        elapsedTime={elapsedTime}
        onSave={handleSaveSession}
        onDiscard={handleDiscardSession}
      />
    </main>
  );
}