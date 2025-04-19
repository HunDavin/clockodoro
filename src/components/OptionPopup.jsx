import { useState, useEffect } from "react";

export default function OptionPopup({ onClose, onUpdate, modeData }) {
  const focusIndex = modeData.findIndex(m => m.mode === "Focus");
  const shortBreakIndex = modeData.findIndex(m => m.mode === "Short Break");
  const longBreakIndex = modeData.findIndex(m => m.mode === "Long Break");
  
  const [focus, setFocus] = useState(() => {
    // First try to get from localStorage, otherwise use modeData
    return localStorage.getItem("focusDuration") ? 
      parseInt(localStorage.getItem("focusDuration")) : 
      modeData[focusIndex].minutes;
  });
  
  const [shortBreak, setShortBreak] = useState(() => {
    return localStorage.getItem("shortBreakDuration") ?
      parseInt(localStorage.getItem("shortBreakDuration")) :
      modeData[shortBreakIndex].minutes;
  });
  
  const [longBreak, setLongBreak] = useState(() => {
    return localStorage.getItem("longBreakDuration") ?
      parseInt(localStorage.getItem("longBreakDuration")) :
      modeData[longBreakIndex].minutes;
  });
  
  // Long break interval state
  const [longBreakInterval, setLongBreakInterval] = useState(() => {
    return localStorage.getItem("longBreakInterval") ? 
      parseInt(localStorage.getItem("longBreakInterval")) : 
      4;
  });
  
  // Auto start settings
  const [autoStartBreak, setAutoStartBreak] = useState(() => {
    return localStorage.getItem("autoStartBreak") === "true";
  });
  
  const [autoStartFocus, setAutoStartFocus] = useState(() => {
    return localStorage.getItem("autoStartFocus") === "true";
  });
  
  // Sound settings
  const [alarmVolume, setAlarmVolume] = useState(() => {
    return localStorage.getItem("alarmVolume") || 50;
  });
  const [tickingVolume, setTickingVolume] = useState(() => {
    return localStorage.getItem("tickingVolume") || 50;
  });
  const [alarmSound, setAlarmSound] = useState(() => {
    return localStorage.getItem("alarmSound") || "Ding";
  });
  const [tickingSound, setTickingSound] = useState(() => {
    return localStorage.getItem("tickingSound") || "Rain";
  });
  const [alarmRepeats, setAlarmRepeats] = useState(() => {
    return localStorage.getItem("alarmRepeats") || 4;
  });
  
  const slider1Style = {
    background: `linear-gradient(to right, #FF5C5C 0%, #FF5C5C ${alarmVolume}%, #ddd ${alarmVolume}%, #ddd 100%)`
  };
  
  const slider2Style = {
    background: `linear-gradient(to right, #FF5C5C 0%, #FF5C5C ${tickingVolume}%, #ddd ${tickingVolume}%, #ddd 100%)`
  };
  
  // Update local state if modeData changes from other sources
  useEffect(() => {
    if (focusIndex !== -1 && !localStorage.getItem("focusDuration")) {
      setFocus(modeData[focusIndex].minutes);
    }
    if (shortBreakIndex !== -1 && !localStorage.getItem("shortBreakDuration")) {
      setShortBreak(modeData[shortBreakIndex].minutes);
    }
    if (longBreakIndex !== -1 && !localStorage.getItem("longBreakDuration")) {
      setLongBreak(modeData[longBreakIndex].minutes);
    }
  }, [modeData, focusIndex, shortBreakIndex, longBreakIndex]);

  // Handle saving all settings to localStorage when Done is clicked
  const saveSettings = () => {
    // Save all settings to localStorage
    localStorage.setItem("alarmVolume", alarmVolume);
    localStorage.setItem("tickingVolume", tickingVolume);
    localStorage.setItem("alarmSound", alarmSound);
    localStorage.setItem("tickingSound", tickingSound);
    localStorage.setItem("alarmRepeats", alarmRepeats);
    localStorage.setItem("longBreakInterval", longBreakInterval);
    localStorage.setItem("autoStartBreak", autoStartBreak);
    localStorage.setItem("autoStartFocus", autoStartFocus);
    
    // Save timer durations to localStorage
    localStorage.setItem("focusDuration", focus);
    localStorage.setItem("shortBreakDuration", shortBreak);
    localStorage.setItem("longBreakDuration", longBreak);
    
    // Trigger storage event for Timer component to detect
    window.dispatchEvent(new Event('storage'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save all settings when user submits the form
    saveSettings();
    
    // Call the parent's update function to update the UI
    onUpdate(focus, longBreak, shortBreak);
  };

  // Handle the close button click without saving
  const handleClose = () => {
    // Just close the popup without saving any changes
    onClose();
  };

  return (
    <>
      <div className="popup-overlay active"></div>
      <form className="options-popup" onSubmit={handleSubmit}>
        <div className="options-header">
          <h2>Options</h2>
          <button type="button" className="close-button" onClick={handleClose}>×</button>
        </div>
        <div className="options-content">
          <div className="option-section">
            <h3>Time (Minutes)</h3>
            <div className="time-inputs">
              <div className="time-input">
                <label>Pomodoro</label>
                <input type="number" className="time-field" onChange={(e) => setFocus(Number(e.target.value))} value={focus} min="0" />
              </div>
              <div className="time-input">
                <label>Short Break</label>
                <input type="number" value={shortBreak} className="time-field" onChange={(e) => setShortBreak(Number(e.target.value))} min="0" />
              </div>
              <div className="time-input">
                <label>Long Break</label>
                <input type="number" value={longBreak} className="time-field" onChange={(e) => setLongBreak(Number(e.target.value))} min="0" />
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="option-section toggle-section">
            <div className="toggle-label">Auto Start Break</div>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={autoStartBreak}
                onChange={() => setAutoStartBreak(prev => !prev)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="divider"></div>
          <div className="option-section toggle-section">
            <div className="toggle-label">Auto Start Focus</div>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={autoStartFocus}
                onChange={() => setAutoStartFocus(prev => !prev)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="divider"></div>
          <div className="option-section">
            <div className="interval-section">
              <div className="interval-label">Long Break Interval</div>
              <input 
                type="number" 
                value={longBreakInterval}
                onChange={(e) => setLongBreakInterval(Number(e.target.value))}
                className="interval-field" 
                min="1" 
                max="5"
              />
            </div>
          </div>
          <div className="divider"></div>
          <div className="option-section">
            <h3>Alarm Sound</h3>
            <div className="sound-section">
              <div className="sound-row">
                <div className="sound-column">
                  <label>Sound</label>
                  <div className="select-wrapper">
                    <select 
                      className="sound-select" 
                      value={alarmSound}
                      onChange={(e) => setAlarmSound(e.target.value)}
                    >
                      <option value="Alarm">Alarm</option>
                    </select>
                  </div>
                </div>
                <div className="sound-column">
                  <label>Repeat</label>
                  <input 
                    type="number" 
                    value={alarmRepeats} 
                    onChange={(e) => setAlarmRepeats(Number(e.target.value))}
                    className="repeat-field" 
                    min="1" 
                  />
                </div>
              </div>
              <div className="volume-row">
                <label>Volume</label>
                <div className="volume-control">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    style={slider1Style} 
                    value={alarmVolume} 
                    onChange={(e) => setAlarmVolume(e.target.value)} 
                    className="volume-slider" 
                  />
                  <span className="volume-value">{alarmVolume}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="option-section">
            <h3>Ticking Sound</h3>
            <div className="sound-section">
              <div className="sound-row">
                <div className="sound-column full-width">
                  <label>Sound</label>
                  <div className="select-wrapper">
                    <select 
                      className="sound-select" 
                      value={tickingSound}
                      onChange={(e) => setTickingSound(e.target.value)}
                    >
                      <option value="Tick">Tick</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="volume-row">
                <label>Volume</label>
                <div className="volume-control">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    style={slider2Style} 
                    value={tickingVolume} 
                    onChange={(e) => setTickingVolume(e.target.value)} 
                    className="volume-slider" 
                  />
                  <span className="volume-value">{tickingVolume}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="done-section">
            <button className="done-button" type="submit">Done</button>
          </div>
        </div>
      </form>
    </>
  );
}