import { useState, useEffect } from "react";

export default function OptionPopup({ onClose, onUpdate, modeData }) {
  const focusIndex = modeData.findIndex(m => m.mode === "Focus");
  const shortBreakIndex = modeData.findIndex(m => m.mode === "Short Break");
  const longBreakIndex = modeData.findIndex(m => m.mode === "Long Break");
  
  const [focus, setFocus] = useState(modeData[focusIndex].minutes);
  const [shortBreak, setShortBreak] = useState(modeData[shortBreakIndex].minutes);
  const [longBreak, setLongBreak] = useState(modeData[longBreakIndex].minutes);
  const [volume1, setVolume1] = useState(50);
  const [volume2, setVolume2] = useState(50);
  
  const slider1Style = {
    background: `linear-gradient(to right, #FF5C5C 0%, #FF5C5C ${volume1}%, #ddd ${volume1}%, #ddd 100%)`
  };
  
  const slider2Style = {
    background: `linear-gradient(to right, #FF5C5C 0%, #FF5C5C ${volume2}%, #ddd ${volume2}%, #ddd 100%)`
  };
  
  useEffect(() => {
    if (focusIndex !== -1) setFocus(modeData[focusIndex].minutes);
    if (shortBreakIndex !== -1) setShortBreak(modeData[shortBreakIndex].minutes);
    if (longBreakIndex !== -1) setLongBreak(modeData[longBreakIndex].minutes);
  }, [modeData, focusIndex, shortBreakIndex, longBreakIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(focus, longBreak, shortBreak);
  };

  return (
    <>
      <div className="popup-overlay active"></div>
      <form className="options-popup" onSubmit={handleSubmit}>
        <div className="options-header">
          <h2>Options</h2>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="options-content">
          <div className="option-section">
            <h3>Time (Minutes)</h3>
            <div className="time-inputs">
              <div className="time-input">
                <label>Pomodoro</label>
                <input type="number" className="time-field" onChange={(e) => setFocus(Number(e.target.value))} value={focus} min="1" />
              </div>
              <div className="time-input">
                <label>Short Break</label>
                <input type="number" value={shortBreak} className="time-field" onChange={(e) => setShortBreak(Number(e.target.value))} min="1" />
              </div>
              <div className="time-input">
                <label>Long Break</label>
                <input type="number" value={longBreak} className="time-field" onChange={(e) => setLongBreak(Number(e.target.value))} min="1" />
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="option-section toggle-section">
            <div className="toggle-label">Auto Start Break</div>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="divider"></div>
          <div className="option-section toggle-section">
            <div className="toggle-label">Auto Start Focus</div>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="divider"></div>
          <div className="option-section">
            <div className="interval-section">
              <div className="interval-label">Long Break Interval</div>
              <input type="number" defaultValue="4" className="interval-field" min="1" />
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
                    <select className="sound-select">
                      <option>Ding</option>
                    </select>
                  </div>
                </div>
                <div className="sound-column">
                  <label>Repeat</label>
                  <input type="number" defaultValue="4" className="repeat-field" min="1" />
                </div>
              </div>
              <div className="volume-row">
                <label>Volume</label>
                <div className="volume-control">
                  <input type="range" min="0" max="100" style={slider1Style} value={volume1} onChange={(e) => setVolume1(e.target.value)} className="volume-slider" />
                  <span className="volume-value">{volume1}</span>
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
                    <select className="sound-select">
                      <option>Rain</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="volume-row">
                <label>Volume</label>
                <div className="volume-control">
                  <input type="range" min="0" max="100" style={slider2Style} value={volume2} onChange={(e) => setVolume2(e.target.value)} className="volume-slider" />
                  <span className="volume-value">{volume2}</span>
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
