import { useEffect } from "react";

export default function TaskCompletedPopup({ visible, onClose, taskName }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="task-completed-popup">
      <div className="task-completed-content">
        <div className="task-completed-icon">✓</div>
        <div className="task-completed-message">
          <p className="task-completed-title">Task Completed!</p>
          <p className="task-completed-name">{taskName}</p>
        </div>
        <button className="task-completed-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}