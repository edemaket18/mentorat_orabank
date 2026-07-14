import React from 'react';
import ReactDOM from 'react-dom/client';
import  App from './App';
import './styles/mobile.css';
//import { Provider } from 'react-redux'
//import { Normalize } from 'styled-normalize'

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('Service worker registration failed:', err);
    });
  });
}
