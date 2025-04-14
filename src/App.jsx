import { useEffect, useState } from "react";
import { modes } from "./data";
import Header from "./components/Header";
import OptionPopup from "./components/OptionPopup";
import Timer from "./components/Timer";

function App() {
  const [mode, setMode] = useState([...modes]);
  const [showTimeOption, setShowTimeOption] = useState(false);
  const [modeIndex, setModeIndex] = useState(0);
  const turnOnTimeOption = () => setShowTimeOption(true);
  const turnOffTimeOption = () => setShowTimeOption(false);

  function handleOptionUpdate(focus, longBreak, shortBreak) {
    setMode(prevMode => prevMode.map(m => {
      if (m.mode === "Focus") return {...m, minutes: focus};
      if (m.mode === "Short Break") return {...m, minutes: shortBreak};
      if (m.mode === "Long Break") return {...m, minutes: longBreak};
      return m;
    }));
    setShowTimeOption(false);
  }

  useEffect(() => {
    document.body.style.backgroundColor = mode[modeIndex].background;
  }, [modeIndex, mode]);

  return (
    <div className="app-container">
      <Header onTimer={turnOnTimeOption} />
      <Timer modeData={mode} onModeChange={setModeIndex}/>
      {showTimeOption && <OptionPopup onClose={turnOffTimeOption} onUpdate={handleOptionUpdate} modeData={mode}/>}
    </div>
  );
}

export default App;