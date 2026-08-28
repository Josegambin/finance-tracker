import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    navigate('/login');
  };

   return (

    <>
      <Navbar />

      <main className="page-container">

        <p className="eyebrow">
          OVERVIEW
        </p>

        <h1>
          Dashboard
        </h1>

        <p className="page-description">
          Welcome back. Here you will see
          a summary of your finances.
        </p>

        <section className="dashboard-placeholder">

          <div>

            <span>
              📊
            </span>

            <h2>
              Your financial dashboard
              is coming soon
            </h2>

            <p>
              First, create some categories.
            </p>

          </div>

        </section>

      </main>

    </>

  );
}