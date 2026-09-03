import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {

  const { theme, toggleTheme } = useTheme();

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
            Dashboard
          </Link>

          <Link to="/transactions">
            Transactions
          </Link>

          <Link to="/categories">
            Categories
          </Link>

          <Link to="/budgets">
            Budgets
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
            Logout
          </button>
        </div>

      </div>

    </nav>
  );
}