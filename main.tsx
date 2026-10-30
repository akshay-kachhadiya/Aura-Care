import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CareProvider } from './state/CareContext';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CareProvider><App /></CareProvider>
  </React.StrictMode>,
);
