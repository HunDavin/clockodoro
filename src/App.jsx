import { useState } from "react";
import { modes } from "./data";
import Header from "./components/Header";
import Timer from "./components/Timer";
import Wave from "./components/Wave";
import OptionPopup from "./components/OptionPopup";

function App() {
  const [mode, setMode] = useState([...modes]);
  const [showTimeOption, setShowTimeOption] = useState(false);
  const [modeIndex, setModeIndex] = useState(0);

  const turnOnTimeOption = () => {
    setShowTimeOption(true); 
    document.body.classList.add('popup-active');
  }

  const turnOffTimeOption = () => {
    setShowTimeOption(false); 
    document.body.classList.remove('popup-active');
  }

  function handleOptionUpdate(focus, longBreak, shortBreak) {
    setMode(prevMode => prevMode.map(m => {
      if (m.mode === "Focus") return {...m, minutes: focus};
      if (m.mode === "Short Break") return {...m, minutes: shortBreak};
      if (m.mode === "Long Break") return {...m, minutes: longBreak};
      return m;
    }));
    setShowTimeOption(false);
    document.body.classList.remove('popup-active');
  }

  return (
    <div className="app-container">
      <Header onTimer={turnOnTimeOption} />
      <Timer modeData={mode} onModeChange={setModeIndex}/>
      <Wave activeMode={mode[modeIndex]} />
      {showTimeOption && <OptionPopup onClose={turnOffTimeOption} onUpdate={handleOptionUpdate} modeData={mode}/>}
    </div>
  );
}

export default App;