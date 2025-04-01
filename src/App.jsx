import { useEffect, useState } from "react";
import logo from "./assets/Clockodoro.png";
import sound from "./assets/Sound.png";
import noSound from "./assets/noSound.png";
import { modes } from "./data";

const INITIAL_DURATION = 0.5;

function App() {
  const [timeLeft, setTimeLeft] = useState(INITIAL_DURATION * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [selectedModeId, setSelectedModeId] = useState(1);
  const [bgColor, setBgColor] = useState("#FFF3E2");
  
  useEffect(() => {
    if (timeLeft === 0 || !isRunning) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);
  
  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
  }, [bgColor]);
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const handleModeSelect = (newColor, modeId) => {
    setSelectedModeId(modeId);
    setBgColor(newColor);
  };
  
  const toggleTimer = () => setIsRunning(!isRunning);
  const toggleSound = () => setIsSoundEnabled(!isSoundEnabled);
  
  const formatTime = (value) => (value < 10 ? `0${value}` : value);
  
  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img src={logo} alt="Clockodoro" width="170" height="40" />
          </a>
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Add Task</button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#">Action</a></li>
              <li><a className="dropdown-item" href="#">Another action</a></li>
              <li><a className="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </div>
        </div>
      </nav>
      
      <div>
        <h1 className="timer-display">{formatTime(minutes)} : {formatTime(seconds)}</h1>
      </div>
      
      <div className="timer-container">
        <div className="mode-wrapper">
          {modes.map((mode) => (
            <div key={mode.id}className="mode-container" style={{ backgroundColor: selectedModeId === mode.id ? mode.btnColor : "white" }} onClick={() => handleModeSelect(mode.background, mode.id)}>
              <div className="mode-row">
                <p className="mode-text" style={{ color: selectedModeId === mode.id ? "white" : "black" }}>{mode.mode}</p>
                {selectedModeId === mode.id && (
                  <img onClick={(e) => {e.stopPropagation();toggleSound();}} className="mode-icon sound-icon" src={isSoundEnabled ? sound : noSound} alt="Sound toggle" />
                )}
              </div>
              <div className="mode-row">
                <img className="mode-icon" src={mode.icon} alt={mode.mode} />
                <div className="mode-time">
                  <p className="mode-time-text" style={{ color: selectedModeId === mode.id ? "white" : "black" }}>12</p>
                  <p className="mode-text" style={{ color: selectedModeId === mode.id ? "white" : "black" }}>min</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="timer-btn" onClick={toggleTimer}>{isRunning ? 'PAUSE' : 'START'}</button>
      </div>
    </>
  );
}

export default App;