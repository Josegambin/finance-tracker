import {
  Link,
  useNavigate
} from 'react-router-dom';

import { useAuth }
  from '../context/AuthContext';

export default function Navbar() {

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    navigate('/login');
  };

  return (

    <header className="navbar">

      <div className="navbar-container">

        <Link
          to="/dashboard"
          className="brand"
        >

          <span className="brand-icon">
            €
          </span>

          <span>
            Finance Tracker
          </span>

        </Link>

        <nav className="nav-links">

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/categories">
            Categories
          </Link>

        </nav>

        <button
          className="button button-secondary"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </header>

  );
}