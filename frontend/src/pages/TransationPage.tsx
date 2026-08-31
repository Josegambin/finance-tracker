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
  CreateTransactionRequest,
  TransactionType,
} from '../types/transaction';
import TransactionFilters from '../components/TransactionFilters';

export default function TransactionsPage() {

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState('');

  const [typeFilter, setTypeFilter] =
    useState<
      TransactionType | 'ALL'
    >('ALL');

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

  const filteredTransactions =
  transactions.filter(
    transaction => {

      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesType =
        typeFilter === 'ALL' ||
        transaction.type === typeFilter;

      return (
        matchesSearch &&
        matchesType
      );
    }
  );

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

        <TransactionFilters
          search={search}
          type={typeFilter}
          onSearchChange={setSearch}
          onTypeChange={setTypeFilter}
        />
          <div className="section-header">

            <div>

              <h2>
                Your transactions
              </h2>

              <p>
                {filteredTransactions.length} transactions
              </p>

            </div>

          </div>

          <TransactionList
            transactions={filteredTransactions}
            onDelete={handleDelete}
          />

        </section>

      </main>

    </>

  );
}