import { useEffect, useState } from "react";
import logo from "./assets/Clockodoro.png";
import sound from "./assets/Sound.png";
import noSound from "./assets/noSound.png";
import { modes } from "./data";
import Header from "./components/Header";
import OptionPopup from "./components/OptionPopup";
import Timer from "./components/Timer";




function final_app(){

  const [mode,setmode]=useState([...modes]);
  const [TimeOption,setTimeOption]=useState(false);
  const [modeIndex,setmodeIndex] = useState(0);
 
    function navclicked(message){
      message === "time" ? console.log("time"): message === "report"? console.log("report") : null
      message === "time" ? setTimeOption(true): setTimeOption(false);
    }

    function closeOptionPopUp(timer){
      timer ? setTimeOption(false) : null; 
    }

    function handleOptionPopup(focus,longBreak,shortBreak){
      const updateMode = mode.map((m)=>{
        if (m.mode === "Focus") m.minutes = focus;
        if (m.mode === "Short Break") m.minutes =shortBreak;
        if (m.mode === "Long Break") m.minutes = longBreak;
        return m;
      })
      setmode(updateMode);
    }
    console.log(mode);

    function getIndexofActive(index){
      setmodeIndex(index);
    }

    useEffect(()=>{
      document.body.style.backgroundColor = mode[modeIndex].background;

    },[modeIndex])





  return (

    <div className={`app_container`}>
      <Header func={navclicked}/>
      {TimeOption && <OptionPopup CloseToggle={closeOptionPopUp} FormOutput={handleOptionPopup} modeData={mode}/> }
      <main className="timer-section">
        <Timer modeData={mode} activeIndex={getIndexofActive}/>
      </main>


    </div>


  )





}




export default final_app;














function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [selectedModeId, setSelectedModeId] = useState(1);
  const [bgColor, setBgColor] = useState("#FFF3E2");
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatTime = (value) => (value < 10 ? `0${value}` : value);
  
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
  
  const handleModeSelect = (mode) => {
    setSelectedModeId(mode.id);
    setBgColor(mode.background);
    
    const modeMinutes = mode.id === 1 ? 25 : mode.id === 2 ? 5 : 30;
    setTimeLeft(modeMinutes * 60);
  };  
  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Clockodoro" height="40" />
          <span className="logo-text">Clockodoro</span>
        </div>
        
        <div className="nav-controls">
          <div className="task-dropdown">
            <button className="task-button">
              <span className="check-icon">✓</span>
              Add Task
              <span className="dropdown-arrow">▼</span>
            </button>
          </div>
          
          <nav className="nav-links">
            <a href="#" className="nav-link">Timer Option</a>
            <a href="#" className="nav-link">Report</a>
          </nav>
          
          <button className="login-button">Login</button>
        </div>
      </header>

      <main className="timer-section">
        <h2 className="timer-title">Focus Timer</h2>
        
        <div className="timer-display">
          <span className="time">{formatTime(minutes)}</span>
          <span className="separator">:</span>
          <span className="time">{formatTime(seconds)}</span>
        </div>
        
        <div className="timer-dots">
          <span className="dot">⦿</span>
          <span className="dot">⦿</span>
          <span className="dot">⦿</span>
          <span className="dot">⦿</span>
        </div>
        
        <div className="controls-container">
          {modes.map((mode) => (
            <div key={mode.id}
              className={`mode-button ${selectedModeId === mode.id ? 'active' : ''}`}
              style={{
                backgroundColor: selectedModeId === mode.id ? mode.btnColor : 'white',
                color: selectedModeId === mode.id ? 'white' : 'black'
              }}
              onClick={() => handleModeSelect(mode)}
            >
              <div className="mode-header">
                <span className="mode-name">{mode.mode}</span>
                {selectedModeId === mode.id && (
                  <img 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSoundEnabled(!isSoundEnabled);
                    }} 
                    className="sound-icon" 
                    src={isSoundEnabled ? sound : noSound} 
                    alt="Sound toggle" 
                  />
                )}
              </div>
              
              <div className="mode-content">
                <img className="mode-icon" src={mode.icon} alt={mode.mode} />
                <div className="mode-time-display">
                  <span className="mode-minutes">
                    {mode.id === 1 ? '25' : mode.id === 2 ? '05' : '30'}
                  </span>
                  <span className="min-label">min</span>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            className="start-button"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'PAUSE' : 'START'}
          </button>
        </div>
      </main>
    </div>
  );
}