import { useState } from "react"
import sound from "../assets/component/Sound.png"
import noSound from "../assets/component/noSound.png"
import { Mode } from "../data";
export default function ModeBtn(){
    const [Sound,setSound] = useState(true);
    const [Select,setSelect] = useState(1);
    const [bgColor,setbgColor] = useState("#FFF3E2");
    document.body.style.backgroundColor = bgColor;

    const handleClick = (newColor,getID) =>{
        setSelect(getID);
        setbgColor(newColor);
        document.body.style.backgroundColor = newColor;
    }


    return <div className="MbtnWrapper">
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



}