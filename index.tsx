
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  
  // เพิ่มการดักจับ Error ทั่วไป
  window.onerror = (message, source, lineno, colno, error) => {
    console.error("Global Error:", message, error);
    if (rootElement.innerHTML === "" || rootElement.innerHTML.includes("กำลังเตรียมระบบ")) {
      rootElement.innerHTML = `
        <div style="padding: 40px; text-align: center; font-family: 'Kanit', sans-serif;">
          <h2 style="color: #ef4444;">เกิดข้อผิดพลาดในการโหลดระบบ</h2>
          <p style="color: #64748b;">${message}</p>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer;">ลองใหม่อีกครั้ง</button>
        </div>
      `;
    }
  };

  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Mounting Error:", err);
  }
}
