import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { logout as logoutApi } from '../api/authApi';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { logout, refreshToken } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language.startsWith('es') ? 'es' : 'en';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link active' : 'nav-link';

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch {
      // Ignore server-side logout issues and clear local auth state anyway.
    } finally {
      logout();
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary border-bottom shadow-sm px-3">
      <NavLink
        to="/dashboard"
        className="navbar-brand d-flex align-items-center gap-2 fw-bold"
      >
        <span
          className="brand-logo d-inline-flex align-items-center justify-content-center rounded-2"
          style={{ width: 34, height: 34, fontSize: '1.05rem', fontWeight: 800 }}
        >
          €
        </span>
        {t('app.title')}
      </NavLink>

      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <NavLink to="/dashboard" className={linkClass} onClick={closeMenu}>
              {t('nav.dashboard')}
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/transactions" className={linkClass} onClick={closeMenu}>
              {t('nav.transactions')}
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/categories" className={linkClass} onClick={closeMenu}>
              {t('nav.categories')}
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/budgets" className={linkClass} onClick={closeMenu}>
              {t('nav.budgets')}
            </NavLink>
          </li>
        </ul>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => changeLanguage(currentLang === 'es' ? 'en' : 'es')}
            aria-label="Change language"
            title="Change language / Cambiar idioma"
          >
            {currentLang === 'es' ? '🇬🇧' : '🇪🇸'}
          </button>

          <button
            className="btn btn-outline-secondary"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button
            className="btn btn-outline-danger"
            onClick={handleLogout}
          >
            {t('nav.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
}

