import { useState, useEffect, useRef } from "react";

export default function Task() {
  const [tasks, setTasks] = useState(["HomeWork", "Other"]);
  const [selectedTask, setSelectedTask] = useState("Choose Task");
  const [newTaskInput, setNewTaskInput] = useState("");
  const [showTaskList, setShowTaskList] = useState(false);
  const taskRef = useRef(null);

  const handleAddTask = () => {
    if (newTaskInput.trim() === "") return;
    setTasks(prev => [newTaskInput, ...prev]);
    setNewTaskInput("");
  };
  
  const handleRemoveTask = (taskToRemove, e) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(task => task !== taskToRemove));
  };
  
  const handleRemoveSelectedTask = (e) => {
    e.stopPropagation();
    
    if (selectedTask !== "Choose Task") {
      setTasks(prev => prev.filter(task => task !== selectedTask));
      
      setSelectedTask("Choose Task");
    }
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setShowTaskList(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (taskRef.current && !taskRef.current.contains(event.target)) {
        setShowTaskList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="task-container" ref={taskRef}>
      <button className="task-button" onClick={() => setShowTaskList(prev => !prev)}>
        <span className="check-icon" onClick={handleRemoveSelectedTask}>✓</span>
        <span className="task-text">{selectedTask}</span>
        <span className="dropdown-arrow">▼</span>
      </button>
      {showTaskList && (
        <ul className="task-list">
          {tasks.map((task, index) => (
            <li key={index} className="task-item" onClick={() => handleTaskSelect(task)}>
              {task}
              <span className="task-cancel" onClick={(e) => handleRemoveTask(task, e)}>&minus;</span>
            </li>
          ))}
          {tasks.length > 0 && <li className="task-divider"></li>}
          <li className="task-item add-task">
            <input className="task-input" type="text" placeholder="Add Task" value={newTaskInput} onChange={(e) => setNewTaskInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddTask()} />
            <button className="task-input-btn" onClick={handleAddTask}>&#43;</button>
          </li>
        </ul>
      )}
    </div>
  );
}