import logo from "../assets/Clockodoro.png"



export default function Header({func}) {
    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Clockodoro" height="42" />
                    <span className="logo-text">Clockodoro</span>
            </div>

            <div className="task-container">
                <button className="task-button">
                    <span className="check-icon">✓</span>
                    <span className="task-text">Add Task</span>
                    <span className="dropdown-arrow">▼</span>
                </button>

                <ul className="task-list">
                    <li className="task-item">Homework<span className="task-cancel">&minus;</span></li>
                    <li className="task-item">Other<span className="task-cancel">&minus;</span></li>
                    <li className="task-divider"></li>
                    <li className="task-item add-task">Add Task</li>
                </ul>
            </div>

            <ul className="nav-lists">
                <li className="nav-list" onClick={()=>func("time")}>Timer Option</li>
                <li className="nav-list" onClick={()=>func("report")}>Report</li>
            </ul>

            <button className="login-button">Login</button>
        </header>
    )
}