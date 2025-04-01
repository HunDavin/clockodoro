import { useEffect, useState } from "react"
import logo from "./assets/Clockodoro.png"
import sound from "./assets/Sound.png"
import noSound from "./assets/noSound.png"
import { Mode } from "./data";

const duration = 0.5;



function App() {
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


      const [Sound,setSound] = useState(true);
      const [Select,setSelect] = useState(1);
      const [bgColor,setbgColor] = useState("#FFF3E2");
      document.body.style.backgroundColor = bgColor;

      const handleClick = (newColor,getID) =>{
          setSelect(getID);
          setbgColor(newColor);
          document.body.style.backgroundColor = newColor;
      }
  


  return (
    <>
      <nav className="navbar bg-body-tertiary">
          <div className="container">
              <a className="navbar-brand" href="#">
                  <img src={logo} alt="Bootstrap" width="170" height="40" />
              </a>
              <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Add Task
                  </button>
                  <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">Action</a></li>
                      <li><a className="dropdown-item" href="#">Another action</a></li>
                      <li><a className="dropdown-item" href="#">Something else here</a></li>
                  </ul>
              </div>
          </div>
      </nav>
      <>
        <div>
            <span style={{  }}>
                <h1 style={{ fontSize: "100px", fontFamily: 'Rowdies, sans-serif' }}>{Min < 10 ? `0${Min}` : Min} : {Sec < 10 ? `0${Sec}` : Sec}</h1>
            </span>

        </div>
        <div className="TimerBtn-Container">
            <div className="MbtnWrapper">
                {Mode.map((m)=>(
                    <div className="MbtnContainer" style={ Select===m.id ? {backgroundColor: m.MbtnColor}:{backgroundColor: "white"} } onClick={() => handleClick(m.background,m.id)}>
                        <div className="MbtnRow">
                            <p className="MbtnText" style={ Select===m.id ? {color : "white"}:{color: "Black"}}>{m.mode}</p>
                            {
                                Select === m.id ? <img onClick={() => { setSound(!Sound) }} className={`MbtnIcon soundIcon `} src={Sound ? sound : noSound} alt="" />
              
                                :null
                            }
                        </div>
                        <div className="MbtnRow">
                            <img className="MbtnIcon" src={m.icon} alt="" />
                            <div className="MbtnTime">
                                <p className="MbtnTime-text" style={ Select===m.id ? {color : "white"}:{color: "black"} }>12</p>
                                <p className="MbtnText" style={ Select===m.id ? {color : "white"}:{color: "Black"}}>min</p>
                            </div>
                        </div>
                    </div>
                  ))}
            </div>
            <button className="Timer-btn" onClick={() => { setIsRunning(!IsRunning) }} > {IsRunning ? 'PAUSE' : 'START'} </button>
        </div>
      </>
    </>
  )
}

export default App
