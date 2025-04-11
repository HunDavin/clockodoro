import { useState } from "react"

export default function Task() {
    const [task,setTask] =useState(["HomeWork","Other"]);




    const[TaskSelect,setTaskSelect] = useState("Choose Task");
    const[TaskInput,setTaskInput] = useState("");

    const handleInput =()=>{
        setTask((prev)=>[TaskInput,...prev]);
        setTaskInput("");
    }
    

    return (<>
        <div className="task-container">
            <button className="task-button">
                <span className="check-icon">✓</span>
                <span className="task-text">{TaskSelect}</span>
                <span className="dropdown-arrow">▼</span>
            </button>

            <ul className="task-list">
                {task.map((t)=>(
                <li className="task-item" onClick={()=>setTaskSelect(t)} >{t}<span className="task-cancel">&minus;</span></li>
                ))}
                <li className="task-divider"></li>
                <li className="task-item">
                    <input className="task-item add-task" type="text" placeholder="Add Task" onChange={(e)=>setTaskInput(e.target.value)} />
                    <button className="add-task-btn" onClick={handleInput}>Add</button>
                </li>
            </ul>
        </div>


    </>)




}
