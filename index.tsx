
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Critical Render Error:", err);
    rootElement.innerHTML = `<div style="padding:40px; text-align:center;"><h2>เกิดข้อผิดพลาดร้ายแรง</h2><p>${err}</p></div>`;
  }
}
