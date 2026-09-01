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

import TransactionFilters
  from '../components/TransactionFilters';

import type {
  Category
} from '../types/category';

import type {
  Transaction,
  CreateTransactionRequest,
  TransactionType
} from '../types/transaction';

export default function TransactionsPage() {

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [currentPage, setCurrentPage] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(0);

  const [totalElements, setTotalElements] =
    useState(0);

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

  const [monthFilter, setMonthFilter] =
    useState('ALL');

  const [categoryFilter, setCategoryFilter] =
    useState<number | 'ALL'>('ALL');

  const [sort, setSort] =
  useState('date,desc');


  /*
   * ============================
   * CLEAR FILTERS
   * ============================
   */

  const clearFilters = () => {

    setSearch('');

    setTypeFilter('ALL');

    setCategoryFilter('ALL');

    setMonthFilter('');

    setSort('date,desc');

    setCurrentPage(0);

  };


  /*
   * ============================
   * LOAD DATA
   * ============================
   */

  const loadData = async () => {

    try {

      setLoading(true);

      setError(null);

      const [
        transactionsData,
        categoriesData
      ] = await Promise.all([

        getTransactions(
          currentPage,
          5, sort
        ),

        getCategories()

      ]);

      setTransactions(
        transactionsData.content
      );

      setTotalPages(
        transactionsData.totalPages
      );

      setTotalElements(
        transactionsData.totalElements
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


  /*
   * ============================
   * LOAD WHEN PAGE CHANGES
   * ============================
   */

  useEffect(() => {

    loadData();

  }, [currentPage, sort]);


  /*
   * ============================
   * CREATE TRANSACTION
   * ============================
   */

  const handleCreate = async (
    transaction: CreateTransactionRequest
  ) => {

    try {

      await createTransaction(
        transaction
      );

      /*
       * Volvemos a la primera página
       * para mostrar la nueva transacción.
       */

      setCurrentPage(0);

    } catch (error) {

      setError(

        error instanceof Error
          ? error.message
          : 'Error creating transaction'

      );

    }

  };


  /*
   * ============================
   * DELETE TRANSACTION
   * ============================
   */

  const handleDelete = async (
    id: number
  ) => {

    try {

      await deleteTransaction(id);

      /*
       * Recargamos la página actual
       * después de eliminar.
       */

      await loadData();

    } catch (error) {

      setError(

        error instanceof Error
          ? error.message
          : 'Error deleting transaction'

      );

    }

  };


  /*
   * ============================
   * PAGINATION
   * ============================
   */

  const goToPreviousPage = () => {

    if (currentPage > 0) {

      setCurrentPage(
        currentPage - 1
      );

    }

  };


  const goToNextPage = () => {

    if (
      currentPage <
      totalPages - 1
    ) {

      setCurrentPage(
        currentPage + 1
      );

    }

  };


  /*
   * ============================
   * AVAILABLE MONTHS
   * ============================
   */

  const availableMonths =
    Array.from(

      new Set(

        transactions.map(
          transaction =>
            transaction.date.substring(
              0,
              7
            )
        )

      )

    )
      .sort()
      .reverse();


  /*
   * ============================
   * FRONTEND FILTERS
   * ============================
   */

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


        const matchesCategory =
          categoryFilter === 'ALL' ||
          transaction.categoryId ===
            categoryFilter;


        const matchesMonth =
          monthFilter === 'ALL' ||
          transaction.date.substring(
            0,
            7
          ) === monthFilter;


        return (

          matchesSearch &&
          matchesType &&
          matchesCategory &&
          matchesMonth

        );

      }
    );


  /*
   * ============================
   * LOADING
   * ============================
   */

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


  /*
   * ============================
   * PAGE
   * ============================
   */

  return (

    <>

      <Navbar />

      <main className="page-container">


        {/* HEADER */}

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


        {/* ERROR */}

        {error && (

          <div className="error-message">

            {error}

          </div>

        )}


        {/* CREATE TRANSACTION */}

        <section className="content-card">

          <h2>
            Add transaction
          </h2>

          <TransactionForm
            categories={categories}
            onCreate={handleCreate}
          />

        </section>


        {/* TRANSACTIONS */}

        <section className="content-card">


          {/* FILTERS */}

          

          <TransactionFilters

  search={search}

  type={typeFilter}

  categoryId={categoryFilter}

  month={monthFilter}

  sort={sort}

  categories={categories}

  months={availableMonths}

  onSearchChange={setSearch}

  onTypeChange={setTypeFilter}

  onCategoryChange={
    setCategoryFilter
  }

  onMonthChange={
    setMonthFilter
  }

  onSortChange={
    (value) => {

      setSort(value);

      setCurrentPage(0);

    }
  }

/>

          {/* SECTION HEADER */}

          <div className="section-header">

            <div>

              <h2>
                Your transactions
              </h2>

              <p>
                {totalElements} transactions
              </p>

            </div>


            <button
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>

          </div>


      
          {totalPages > 1 && (

            <div className="pagination">

              <button
                type="button"
                onClick={
                  goToPreviousPage
                }
                disabled={
                  currentPage === 0
                }
              >
                ← Previous
              </button>


              <span>
                Page {currentPage + 1} of {totalPages}
              </span>


              <button
                type="button"
                onClick={
                  goToNextPage
                }
                disabled={
                  currentPage ===
                  totalPages - 1
                }
              >
                Next →

              </button>

            </div>

          )}


          <TransactionList

            transactions={
              filteredTransactions
            }

            onDelete={
              handleDelete
            }

          />

        </section>

      </main>

    </>

  );

}