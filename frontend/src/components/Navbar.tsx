import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function Navbar() {

  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <nav className="navbar">

      <div className="navbar-container">

        <Link
          to="/dashboard"
          className="navbar-brand"
        >
          <span className="brand-icon">
            €
          </span>

          <span>
            Finance Tracker
          </span>
        </Link>

        <div className="navbar-links">

          <Link to="/dashboard">
            {t('nav.dashboard')}
          </Link>

          <Link to="/transactions">
            {t('nav.transactions')}
          </Link>

          <Link to="/categories">
            {t('nav.categories')}
          </Link>

          <Link to="/budgets">
            {t('budgets.title')}
          </Link>

        </div>

        <div className="navbar-actions">
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

              localStorage.removeItem(
                'finance_tracker_token'
              );

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