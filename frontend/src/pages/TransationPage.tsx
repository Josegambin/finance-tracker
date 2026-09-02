import {
  useEffect,
  useState
} from 'react';

import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  exportTransactionsCsv
} from '../api/transactionApi';

import {
  getCategories
} from '../api/categoryApi';

import Navbar
  from '../components/Navbar';

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

import {
  useTranslation
} from 'react-i18next';


export default function TransactionsPage() {

  const {
    t
  } = useTranslation();


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

  const [exporting, setExporting] =
    useState(false);


  /*
   * ============================
   * CLEAR FILTERS
   * ============================
   */

  const clearFilters = () => {

    setSearch('');

    setTypeFilter('ALL');

    setCategoryFilter('ALL');

    setMonthFilter('ALL');

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
          5,
          sort
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
   * LOAD WHEN PAGE OR SORT CHANGES
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
   * EXPORT CSV
   * ============================
   */


  const handleExportCsv = async () => {

    try {

      setExporting(true);

      setError(null);


      const blob =
        await exportTransactionsCsv(

          search,

          typeFilter,

          categoryFilter === 'ALL'
            ? undefined
            : categoryFilter,

          monthFilter

        );


      const url =
        window.URL.createObjectURL(
          blob
        );


      const link =
        document.createElement(
          'a'
        );


      link.href = url;


      const today =
        new Date()
          .toISOString()
          .substring(
            0,
            10
          );


      link.download =
        `transactions-${today}.csv`;


      document.body.appendChild(
        link
      );


      link.click();


      link.remove();


      window.URL.revokeObjectURL(
        url
      );


    } catch (error) {

      setError(

        error instanceof Error
          ? error.message
          : 'Error exporting transactions'

      );

    } finally {

      setExporting(false);

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
            {t('transactions.loading')}
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

              {t(
                'transactions.financeManagement'
              )}

            </p>

            <h1>

              {t(
                'transactions.title'
              )}

            </h1>

            <p className="page-description">

              {t(
                'transactions.description'
              )}

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

            {t(
              'transactions.addTransaction'
            )}

          </h2>

          <TransactionForm

            categories={
              categories
            }

            onCreate={
              handleCreate
            }

          />

        </section>


        <section className="content-card">


          <TransactionFilters

            search={
              search
            }

            type={
              typeFilter
            }

            categoryId={
              categoryFilter
            }

            month={
              monthFilter
            }

            sort={
              sort
            }

            categories={
              categories
            }

            months={
              availableMonths
            }

            onSearchChange={
              setSearch
            }

            onTypeChange={
              setTypeFilter
            }

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


          <div className="section-header">

            <div>

              <h2>

                {t(
                  'transactions.yourTransactions'
                )}

              </h2>

              <p>

                {t(
                  'transactions.transactionsCount',
                  {
                    count:
                      totalElements
                  }
                )}

              </p>

            </div>


            <div>

              <button

                type="button"

                onClick={
                  handleExportCsv
                }

                disabled={
                  exporting
                }

              >

                {exporting
                  ? `⏳ ${t('transactions.exporting')}`
                  : `📥 ${t('transactions.exportCsv')}`
                }

              </button>


              <button

                type="button"

                onClick={
                  clearFilters
                }

              >

                {t(
                  'transactions.clearFilters'
                )}

              </button>

            </div>

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

                ← {t(
                  'transactions.previous'
                )}

              </button>


              <span>

                {t(
                  'transactions.page'
                )}

                {' '}

                {currentPage + 1}

                {' '}

                {t(
                  'transactions.of'
                )}

                {' '}

                {totalPages}

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

                {t(
                  'transactions.next'
                )}

                {' '}→

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
