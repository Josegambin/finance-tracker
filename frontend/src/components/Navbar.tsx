import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function Navbar() {

  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language.startsWith('es') ? 'es' : 'en';

  // 🎨 Nueva función: Solo añade la clase 'active' si está activo. Sin clases extrañas.
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'active' : '';

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">

      <div className="navbar-container">

        <NavLink
          to="/dashboard"
          className="navbar-brand"
        >
          <span className="brand-icon">
            €
          </span>

          <span>
            Finance Tracker
          </span>
        </NavLink>

        <button
          className={`navbar-burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>


          <NavLink to="/dashboard" className={linkClass} onClick={closeMenu}>
            {t('nav.dashboard')}
          </NavLink>

          <NavLink to="/transactions" className={linkClass} onClick={closeMenu}>
            {t('nav.transactions')}
          </NavLink>

          <NavLink to="/categories" className={linkClass} onClick={closeMenu}>
            {t('nav.categories')}
          </NavLink>

          <NavLink to="/budgets" className={linkClass} onClick={closeMenu}>
            {t('nav.budgets')}
          </NavLink>

        </div>

        <div className="navbar-actions">

          {/* 🌍 SELECTOR DE IDIOMA */}
          <button
            className="theme-toggle"
            onClick={() => changeLanguage(currentLang === 'es' ? 'en' : 'es')}
            aria-label="Change language"
            title="Change language / Cambiar idioma"
          >
            {currentLang === 'es' ? '🇬🇧' : '🇪🇸'}
          </button>

          {/* 🌙 SELECTOR DE TEMA */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button
            className="navbar-logout"
            onClick={() => {
              localStorage.removeItem('finance_tracker_token');
              window.location.href = '/login';
            }}
          >
            {t('nav.logout')}
          </button>
        </div>

      </div>

    </nav>
  );
}