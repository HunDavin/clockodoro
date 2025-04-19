import { useEffect, useState } from "react";

export default function Wave({ activeMode }) {
  const [waveStyle, setWaveStyle] = useState({
    background: "#FF5C5C",
    height: "5vh",
    minHeight: "28px"
  });

  useEffect(() => {
    if (!activeMode) return;
    
    if (activeMode.mode === "Focus") {
      setWaveStyle({
        background: "#FF5C5C",
        height: "5vh",
        minHeight: "28px"
      });
    } else if (activeMode.mode === "Short Break") {
      setWaveStyle({
        background: "#7684FF",
        height: "79vh",
        minHeight: "555px"
      });
    } else if (activeMode.mode === "Long Break") {
      setWaveStyle({
        background: "#696A74",
        height: "79vh",
        minHeight: "555px"
      });
    }
  }, [activeMode]);

  return (
    <footer className="wave-block">
      <div 
        className="wave-stretch" 
        style={{ 
          backgroundColor: waveStyle.background,
          height: waveStyle.height,
          minHeight: waveStyle.minHeight
        }}
      >
        <div 
          className="wavy-wave" 
          style={{ backgroundColor: waveStyle.background }}
        ></div>
      </div>
    </footer>
  );
}