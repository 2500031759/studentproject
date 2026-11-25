import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../css/01-tokens-base.css';
import '../css/02-buttons-badges.css';
import '../css/03-nav-hero.css';
import '../css/04-cards-tables.css';
import '../css/05-admin-portal.css';
import '../css/06-premium-overrides.css';
import '../css/07-team-directory.css';
import './styles/global.css';
import './styles/auth.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ArenaProvider } from './context/ArenaContext';
import { ToastProvider } from './components/ToastProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ArenaProvider>
          <ToastProvider><App /></ToastProvider>
        </ArenaProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
