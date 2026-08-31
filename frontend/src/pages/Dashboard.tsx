import {
  useEffect,
  useState
} from 'react';

import {
  getDashboard,
  getExpensesByCategory
} from '../api/dashboardApi';

import Navbar from '../components/Navbar';

import DashboardCard
  from '../components/DashboardCard';


import RecentTransactions
  from '../components/RecentTransaction';

import type {
  Dashboard
} from '../types/dashboard';

import type {
  ExpenseByCategory
} from '../api/dashboardApi';
import ExpensesByCategoryChart from '../components/charts/ExpensesByCategoryChart';

import type {
  BudgetVsSpentData
} from '../components/charts/BudgetVsSpentChart';
import { getBudgets } from '../api/budgetApi';
import BudgetVsSpentChart from '../components/charts/BudgetVsSpentChart';

export default function Dashboard() {

  const [dashboard, setDashboard] =
    useState<Dashboard | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [
    expensesByCategory,
    setExpensesByCategory
  ] = useState<ExpenseByCategory[]>([]);

  const [
    budgetVsSpent,
    setBudgetVsSpent
  ] = useState<BudgetVsSpentData[]>([]);


  const loadDashboard = async () => {

    try {

      setLoading(true);

      setError(null);

      const [
        dashboardData,
        categoryData,
        budgets
      ] = await Promise.all([

        getDashboard(),

        getExpensesByCategory(),

        getBudgets()

      ]);

      setDashboard(
        dashboardData
      );

      setExpensesByCategory(
        categoryData
      );

      const chartData =
        budgets.map(budget => ({
          name: `${budget.categoryName} (${budget.month})`,
          budget: budget.budgetAmount,
          spent: budget.spentAmount
        }));


      setBudgetVsSpent(
        chartData
      );

      setBudgetVsSpent(
        chartData
      );

    } catch (error) {

      console.error(error);

      setError(
        'Error loading dashboard'
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


      {/* CARDS */}

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


      {/* EXPENSES BY CATEGORY */}

      <section className="dashboard-chart-card">

        <div className="chart-header">

          <h2>
            Expenses by category
          </h2>

          <p>
            Where your money is going.
          </p>

        </div>

        <ExpensesByCategoryChart
          data={expensesByCategory}
        />

      </section>


      {/* BUDGET VS SPENT */}

      <section className="dashboard-chart-card">

        <div className="chart-header">

          <h2>
            Budget vs spent
          </h2>

          <p>
            Compare your budget with your actual spending.
          </p>

        </div>

        <BudgetVsSpentChart
          data={budgetVsSpent}
        />

      </section>


      {/* RECENT TRANSACTIONS */}

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