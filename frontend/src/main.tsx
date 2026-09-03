import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ToastContainer from './components/ToastContainer';
import './styles/app.css';
import './styles/categories.css';
import './styles/transaction.css';
import './styles/dashboard.css';
import './styles/navbar.css';
import './styles/pagination.css';
import './styles/theme.css';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <ToastContainer />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);6