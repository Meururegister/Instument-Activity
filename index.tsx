
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Could not find root element to mount to");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("MelodyManager initialized successfully");
  } catch (error) {
    console.error("Failed to render App:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red;">เกิดข้อผิดพลาดในการโหลดระบบ: ${error.message}</div>`;
  }
};

// ตรวจสอบให้แน่ใจว่า DOM โหลดเสร็จก่อนเริ่ม
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
