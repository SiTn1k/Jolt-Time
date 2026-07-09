import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Telegram Mini App initialization
const initTelegram = () => {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    const webapp = (window as any).Telegram.WebApp;
    webapp.ready();
    webapp.expand();
    webapp.enableClosingConfirmation();
  }
};

initTelegram();

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
