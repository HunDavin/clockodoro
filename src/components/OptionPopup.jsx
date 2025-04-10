import { useState } from "react"



export default function OptionPopup({CloseToggle,FormOutput,modeData}) {
    


    const FocusDuration = modeData[modeData.findIndex((m)=>m.mode==="Focus")].minutes;
    const SBreakDuration = modeData[modeData.findIndex((m)=>m.mode==="Short Break")].minutes;
    const LBreakDuration = modeData[modeData.findIndex((m)=>m.mode==="Long Break")].minutes;

    const[Focus,setFocus]=useState(FocusDuration);
    const[SBreak,setSBreak]=useState(SBreakDuration);
    const[LBreak,setLBreak]=useState(LBreakDuration);

    const [volume1,setvolume1]=useState(50);
    const [volume2,setvolume2]=useState(50);

    const slider1 ={
         background: `linear-gradient(to right, #FF5C5C 0%, #FF5C5C ${volume1}%, #ddd ${volume1}%, #ddd 100%)`
    }
    const slider2 ={
        background: `linear-gradient(to right, #FF5C5C 0%, #FF5C5C ${volume2}%, #ddd ${volume2}%, #ddd 100%)`
   }



    const handleSubmit = (e) =>{
        e.preventDefault();
        FormOutput(Focus,LBreak,SBreak);
        CloseToggle(true)
    }

    return (
        <>
            <div className="popup-overlay active"></div>
            <form className="options-popup" onSubmit={handleSubmit}>
                <div className="options-header">
                    <h2>Options</h2>
                    <button className="close-button" onClick={()=>CloseToggle(true)}>×</button>
                </div>

                <div className="options-content">
                    <div className="option-section">
                        <h3>Time (Minutes)</h3>
                        <div className="time-inputs">
                            <div className="time-input">
                                <label>Pomodoro</label>
                                <input type="text" className="time-field" onChange={(e)=>setFocus(Number(e.target.value))} value={Focus}/>
                            </div>
                            <div className="time-input">
                                <label>Short Break</label>
                                <input type="text" value={SBreak} className="time-field" onChange={(e)=> setSBreak(Number(e.target.value))}/>
                            </div>
                            <div className="time-input">
                                <label>Long Break</label>
                                <input type="text" value={LBreak} className="time-field" onChange={(e)=> setLBreak(Number(e.target.value))}/>
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
                            <input type="text" value="4" className="interval-field" />
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
                                            <option selected>Ding</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="sound-column">
                                    <label>Repeat</label>
                                    <input type="text" value="4" className="repeat-field" />
                                </div>
                            </div>
                            <div className="volume-row">
                                <label>Volume</label>
                                <div className="volume-control">
                                    <input type="range" min="0" max="100" style={slider1} value={volume1} onChange={(e)=>setvolume1(e.target.value)} className="volume-slider" />
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
                                            <option selected>Rain</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="volume-row">
                                <label>Volume</label>
                                <div className="volume-control">
                                    <input type="range" min="0" max="100" style={slider2} value={volume2} onChange={(e)=>setvolume2(e.target.value)} className="volume-slider" />
                                    <span className="volume-value">{volume2}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="done-section">
                        <button className="done-button" type="submit" onClick={handleSubmit}>Done</button>
                    </div>
                </div>
            </form>
        </>
    )


}