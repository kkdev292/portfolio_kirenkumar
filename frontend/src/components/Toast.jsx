import { useState, useEffect } from 'react';

// Singleton for toast functions
let toastId = 0;
let addToastFunc = null;

export const toast = {
  success: (msg) => addToastFunc && addToastFunc({ id: ++toastId, type: 'success', message: msg, icon: '✅' }),
  error: (msg) => addToastFunc && addToastFunc({ id: ++toastId, type: 'error', message: msg, icon: '❌' }),
  info: (msg) => addToastFunc && addToastFunc({ id: ++toastId, type: 'info', message: msg, icon: 'ℹ️' }),
  warning: (msg) => addToastFunc && addToastFunc({ id: ++toastId, type: 'warning', message: msg, icon: '⚠️' }),
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastFunc = (newToast) => {
      setToasts(prev => [...prev, newToast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <div className="toast-icon">{t.icon}</div>
          <div className="toast-content">
            <div className="toast-title">{t.type.charAt(0).toUpperCase() + t.type.slice(1)}</div>
            <div className="toast-msg">{t.message}</div>
          </div>
          <button className="toast-close" onClick={() => removeToast(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
};
