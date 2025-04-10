import { useState } from "react"



export default function OptionPopup({CloseToggle,FormOutput}) {
    const[Focus,setFocus]=useState(25);
    const[SBreak,setSBreak]=useState(5);
    const[LBreak,setLBreak]=useState(30);



    const handleSubmit = (e) =>{
        e.preventDefault();
        FormOutput(Focus,LBreak,SBreak);
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
                                    <input type="range" min="0" max="100" value="50" className="volume-slider" />
                                    <span className="volume-value">50</span>
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
                                    <input type="range" min="0" max="100" value="50" className="volume-slider" />
                                    <span className="volume-value">50</span>
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