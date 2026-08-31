import {
  useEffect,
  useState
} from 'react';

import Navbar from '../components/Navbar';

import BudgetCard
  from '../components/BudgetCard';

import BudgetForm
  from '../components/BudgetForm';

import type {
  Budget,
  CreateBudgetRequest
} from '../types/budget';

import type {
  Category
} from '../types/category';

import {
  getBudgets,
  createBudget,
  deleteBudget
} from '../api/budgetApi';

import {
  getCategories
} from '../api/categoryApi';

export default function BudgetsPage() {

  const [budgets, setBudgets] =
    useState<Budget[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadData = async () => {

    try {

      setLoading(true);

      const [
        budgetsData,
        categoriesData
      ] = await Promise.all([
        getBudgets(),
        getCategories()
      ]);

      setBudgets(
        budgetsData
      );

      setCategories(
        categoriesData
      );

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

    loadData();

  }, []);

  const handleCreate =
    async (
      request: CreateBudgetRequest
    ) => {

      try {

        const newBudget =
          await createBudget(
            request
          );

        setBudgets(
          previous => [
            newBudget,
            ...previous
          ]
        );

      } catch (error) {

        setError(
          error instanceof Error
            ? error.message
            : 'Error creating budget'
        );
      }
    };

  const handleDelete =
    async (
      id: number
    ) => {

      try {

        await deleteBudget(id);

        setBudgets(
          previous =>
            previous.filter(
              budget =>
                budget.id !== id
            )
        );

      } catch (error) {

        setError(
          error instanceof Error
            ? error.message
            : 'Error deleting budget'
        );
      }
    };

  if (loading) {

    return (
      <>
        <Navbar />

        <main className="page-container">

          <p>
            Loading budgets...
          </p>

        </main>
      </>
    );
  }

  return (

    <>
      <Navbar />

      <main className="page-container">

        <div className="page-header">

          <p className="eyebrow">
            BUDGET MANAGEMENT
          </p>

          <h1>
            Budgets
          </h1>

          <p className="page-description">
            Control your monthly spending.
          </p>

        </div>

        {error && (

          <div className="error-message">
            {error}
          </div>

        )}

        <section className="content-card">

          <h2>
            Create budget
          </h2>

          <BudgetForm
            categories={categories}
            onCreate={handleCreate}
          />

        </section>

        <section className="content-card">

          <div className="section-header">

            <div>

              <h2>
                Your budgets
              </h2>

              <p>
                Track your spending by category.
              </p>

            </div>

            <span>
              {budgets.length} budgets
            </span>

          </div>

          {budgets.length === 0 ? (

            <div className="empty-state">

              <span>
                💰
              </span>

              <h3>
                No budgets yet
              </h3>

              <p>
                Create your first monthly budget.
              </p>

            </div>

          ) : (

            <div className="budgets-list">

              {budgets.map(
                budget => (

                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    onDelete={handleDelete}
                  />

                )
              )}

            </div>

          )}

        </section>

      </main>
    </>
  );
}