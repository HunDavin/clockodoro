import logo from "../assets/Clockodoro.png";
import Task from "./Task";

export default function Header({ onTimer, onReport }) {
  return (
    <header className="header">
      <div className="logo-container" onClick={() => window.location.reload()}>
        <img src={logo} alt="Clockodoro" height="42" />
        <span className="logo-text">Clockodoro</span>
      </div>
      <Task />
      <ul className="nav-lists">
        <li className="nav-list" onClick={onTimer}>Timer Option</li>
        <li className="nav-list" onClick={onReport}>Report</li>
      </ul>
      <button className="login-button">Login</button>
    </header>
  );
}