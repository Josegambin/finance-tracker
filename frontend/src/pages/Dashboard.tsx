import {
  useEffect,
  useState
} from 'react';

import {
  getDashboard
} from '../api/dashboardApi';

import Navbar from '../components/Navbar';

import DashboardCard
  from '../components/DashboardCard';

import RecentTransactions
  from '../components/RecentTransaction';

import type {
  Dashboard
} from '../types/dashboard';

export default function Dashboard() {

  const [dashboard, setDashboard] =
    useState<Dashboard | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadDashboard = async () => {

    try {

      setLoading(true);

      const data =
        await getDashboard();

      setDashboard(data);

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : 'Unexpected error'
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    loadDashboard();

  }, []);

  if (loading) {

    return (
      <>
        <Navbar />

        <main className="page-container">

          <p>
            Loading dashboard...
          </p>

        </main>
      </>
    );
  }

  if (error) {

    return (
      <>
        <Navbar />

        <main className="page-container">

          <div className="error-message">
            {error}
          </div>

        </main>
      </>
    );
  }

  if (!dashboard) {

    return null;
  }

  return (

    <>
      <Navbar />

      <main className="page-container">

        <div className="page-header">

          <div>

            <p className="eyebrow">
              FINANCE OVERVIEW
            </p>

            <h1>
              Dashboard
            </h1>

            <p className="page-description">
              Here's an overview of your finances.
            </p>

          </div>

        </div>

        <section className="dashboard-grid">

          <DashboardCard
            title="Total balance"
            value={dashboard.balance}
            icon="💰"
            type="balance"
          />

          <DashboardCard
            title="Total income"
            value={dashboard.totalIncome}
            icon="↗"
            type="income"
          />

          <DashboardCard
            title="Total expenses"
            value={dashboard.totalExpenses}
            icon="↘"
            type="expense"
          />

        </section>

        <section className="content-card">

          <div className="section-header">

            <div>

              <h2>
                Recent transactions
              </h2>

              <p>
                Your latest financial activity.
              </p>

            </div>

          </div>

          <RecentTransactions
            transactions={
              dashboard.recentTransactions
            }
          />

        </section>

      </main>

    </>
  );
}