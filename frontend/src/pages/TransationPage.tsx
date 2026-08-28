import {
  useEffect,
  useState
} from 'react';

import {
  createTransaction,
  deleteTransaction,
  getTransactions
} from '../api/transactionApi';

import {
  getCategories
} from '../api/categoryApi';

import Navbar from '../components/Navbar';

import TransactionForm
  from '../components/TransactionForm';

import TransactionList
  from '../components/TransactionList';

import type {
  Category
} from '../types/category';

import type {
  Transaction,
  CreateTransactionRequest
} from '../types/transaction';

export default function TransactionsPage() {

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

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
        transactionsData,
        categoriesData
      ] = await Promise.all([
        getTransactions(),
        getCategories()
      ]);

      setTransactions(
        transactionsData
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

  const handleCreate = async (
    transaction: CreateTransactionRequest
  ) => {

    try {

      const newTransaction =
        await createTransaction(
          transaction
        );

      setTransactions(
        currentTransactions => [

          newTransaction,

          ...currentTransactions

        ]
      );

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : 'Error creating transaction'
      );

    }
  };

  const handleDelete = async (
    id: number
  ) => {

    try {

      await deleteTransaction(id);

      setTransactions(
        currentTransactions =>
          currentTransactions.filter(
            transaction =>
              transaction.id !== id
          )
      );

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : 'Error deleting transaction'
      );

    }
  };

  if (loading) {

    return (

      <>
        <Navbar />

        <main className="page-container">

          <p>
            Loading transactions...
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

          <div>

            <p className="eyebrow">
              FINANCE MANAGEMENT
            </p>

            <h1>
              Transactions
            </h1>

            <p className="page-description">
              Track your income and expenses.
            </p>

          </div>

        </div>

        {error && (

          <div className="error-message">

            {error}

          </div>

        )}

        <section className="content-card">

          <h2>
            Add transaction
          </h2>

          <TransactionForm
            categories={categories}
            onCreate={handleCreate}
          />

        </section>

        <section className="content-card">

          <div className="section-header">

            <div>

              <h2>
                Your transactions
              </h2>

              <p>
                {transactions.length} transactions
              </p>

            </div>

          </div>

          <TransactionList
            transactions={transactions}
            onDelete={handleDelete}
          />

        </section>

      </main>

    </>

  );
}