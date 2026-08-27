import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Dashboard() {

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    navigate('/login');
  };

  return (
    <main>

      <h1>Finance Tracker</h1>

      <p>Welcome to your dashboard</p>

      <button onClick={handleLogout}>
        Logout
      </button>

    </main>
  );
}