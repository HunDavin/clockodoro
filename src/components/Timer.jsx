import { useEffect, useState } from "react"
import SoundOn from "../assets/component/Sound.png";
import SoundOff from "../assets/component/noSound.png";
import ModeBtn from "./mode";


export default function Timer({ duration }) {
    const [Timeleft, setTimeleft] = useState(duration * 60);
    const [IsRunning, setIsRunning] = useState(false);




    useEffect(() => {
        if (Timeleft === 0) {
            return;
        }
        if (IsRunning) {
            const Interval = setInterval(() => {
                setTimeleft(Timeleft - 1);
            }, 1000);
            return () => clearInterval(Interval);
        }



    }, [IsRunning, Timeleft]);

    const Min = Math.floor(Timeleft / 60);
    const Sec = Timeleft % 60;


    return <>
        <div>
            <span style={{  }}>
                <h1 style={{ fontSize: "100px", fontFamily: 'Rowdies, sans-serif' }}>{Min < 10 ? `0${Min}` : Min} : {Sec < 10 ? `0${Sec}` : Sec}</h1>
            </span>

        </div>
        <div className="TimerBtn-Container">
            <ModeBtn />
            <button className="Timer-btn" onClick={() => { setIsRunning(!IsRunning) }} > {IsRunning ? 'PAUSE' : 'START'} </button>
        </div>
        
        


    </>
}

