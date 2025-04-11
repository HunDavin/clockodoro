import { useEffect, useState } from "react"

export default function Timer({ modeData }) {
    const [ActiveMode, setActiveMode] = useState(modeData[0]);
    const duration = ActiveMode.minutes;

    useEffect(()=>{
        const Active = modeData.find((m)=>m.mode === ActiveMode.mode)
        if(Active){
            setActiveMode(Active);
        }
    },[modeData]);



    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [isRunning, setIsRunning] = useState(false);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatTime = (value) => (value < 10 ? `0${value}` : value)
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === 0) {
                    clearInterval(interval);
                    setTimeLeft(timeLeft);
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);

    }, [isRunning]);

    useEffect(()=>{
        setTimeLeft(duration*60);
        setIsRunning(false);
    },[ActiveMode])


    function ModeBtn({ mode }) {
        const isActive = ActiveMode.mode === mode.mode;
        return (<>
            <div className={`mode-button ${isActive ? "active" : null} `} 
            style={{ backgroundColor: isActive ? mode.btnColor : "white", color: isActive ? "white" : "#333" }}
            onClick={()=>setActiveMode(mode)}>
                <div className="mode-header">
                    <span className="mode-name">{mode.mode}</span>
                </div>

                <div className="mode-content">
                    <img className="mode-icon" src={mode.icon} alt="Short Break" />
                    <div className="mode-time-display" style={{ color: "#333" }}>
                        <span className="mode-minutes">{mode.minutes}</span>
                        <span className="min-label">min</span>
                    </div>
                </div>
            </div>



        </>)
    }

    return (
        <>
            <h2 className="timer-title">Focus Timer</h2>

            <div className="timer-display">
                <span className="time">{formatTime(minutes)}</span>
                <span className="separator">:</span>
                <span className="time">{formatTime(seconds)}</span>
            </div>

            <div className="clock-icons">
                <img src="/src/assets/Clockicon.png" alt="clockIcon" className="clock-icon" />
                <img src="/src/assets/Clockicon.png" alt="clockIcon" className="clock-icon" />
                <img src="/src/assets/Clockicon.png" alt="clockIcon" className="clock-icon" />
                <img src="/src/assets/Clockicon.png" alt="clockIcon" className="clock-icon" />
            </div>
            <div className="controls-container">
                {modeData.map((m) => (
                    <ModeBtn mode={m} />
                ))}
                <div class="start-button" onClick={() => setIsRunning(!isRunning)}>{isRunning ? "PAUSE" : "START"}</div>
            </div>
        </>
    )


}