import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createTransaction, deleteTransaction, getTransactions, exportTransactionsCsv } from '../api/transactionApi';
import { getCategories } from '../api/categoryApi';
import { useDebounce } from '../hooks/useDebounce';
import Navbar from '../components/Navbar';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import TransactionFilters from '../components/TransactionFilters';
import type { Category } from '../types/category';
import type { Transaction, CreateTransactionRequest, TransactionType } from '../types/transaction';
import { toastService } from '../services/toastService';

export default function TransactionsPage() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [monthFilter, setMonthFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState<number | 'ALL'>('ALL');
  const [sort, setSort] = useState('date,desc');
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  useEffect(() => {
    if (!error && !success) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [error, success]);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (!error && !success) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [error, success]);

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('ALL');
    setCategoryFilter('ALL');
    setMonthFilter('ALL');
    setSort('date,desc');
    setCurrentPage(0);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [transactionsData, categoriesData] = await Promise.all([
        getTransactions({
          page: currentPage,
          size: 5,
          sort,
          search: debouncedSearch || undefined,
          type: typeFilter,
          categoryId: categoryFilter,
          month: monthFilter
        }),
        getCategories()
      ]);
      setTransactions(transactionsData.content);
      setTotalPages(transactionsData.totalPages);
      setTotalElements(transactionsData.totalElements);
      setCategories(categoriesData);
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [currentPage, sort, debouncedSearch, typeFilter, categoryFilter, monthFilter]);

  const handleCreate = async (transaction: CreateTransactionRequest) => {
    try {
      await createTransaction(transaction);
      setCurrentPage(0);
      setSuccess(null);
      const message = t('transactions.created');
      setSuccess(message);
      toastService.success(message);
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.errorCreating'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
       setSuccess(null);
      const message = t('transactions.created');
      setSuccess(message);
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.errorDeleting'));
    }
  };

  const handleExportCsv = async () => {
    try {
      setExporting(true);

      setSuccess(null);
      const message = t('transactions.created');
      setSuccess(message);
      const blob = await exportTransactionsCsv(search, typeFilter, categoryFilter === 'ALL' ? undefined : categoryFilter, monthFilter);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const today = new Date().toISOString().substring(0, 10);
      link.download = `transactions-${today}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.errorCreating'));
    } finally {
      setExporting(false);
    }
  };

  const goToPreviousPage = () => { if (currentPage > 0) setCurrentPage(currentPage - 1); };
  const goToNextPage = () => { if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1); };

  const availableMonths = Array.from(new Set(transactions.map(transaction => transaction.date.substring(0, 7)))).sort().reverse();

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container py-4">
          <p>{t('transactions.loading')}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container py-4">
        <div className="mb-4">
          <p className="text-muted small text-uppercase mb-0">{t('transactions.financeManagement')}</p>
          <h1 className="h2 mb-1">{t('transactions.title')}</h1>
          <p className="text-muted mb-0">{t('transactions.description')}</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <section className="card mb-4 p-3">
          <h2 className="h5">{t('transactions.addTransaction')}</h2>
          <TransactionForm categories={categories} onCreate={handleCreate} />
        </section>

        <section className="card p-3">
          <TransactionFilters
            search={search}
            type={typeFilter}
            categoryId={categoryFilter}
            month={monthFilter}
            sort={sort}
            categories={categories}
            months={availableMonths}
            onSearchChange={(value) => { setSearch(value); setCurrentPage(0); }}
            onTypeChange={(value) => { setTypeFilter(value); setCurrentPage(0); }}
            onCategoryChange={(value) => { setCategoryFilter(value); setCurrentPage(0); }}
            onMonthChange={(value) => { setMonthFilter(value); setCurrentPage(0); }}
            onSortChange={(value) => { setSort(value); setCurrentPage(0); }}
          />

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <h2 className="h5 mb-0">{t('transactions.yourTransactions')}</h2>
              <p className="text-muted small mb-0">{t('transactions.transactionsCount', { count: totalElements })}</p>
            </div>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleExportCsv} disabled={exporting}>
                {exporting ? `⏳ ${t('transactions.exporting')}` : `📥 ${t('transactions.exportCsv')}`}
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
                {t('transactions.clearFilters')}
              </button>
            </div>
          </div>

          {totalPages > 1 && (
            <nav className="d-flex align-items-center justify-content-center gap-2 my-3">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={goToPreviousPage} disabled={currentPage === 0}>
                ← {t('transactions.previous')}
              </button>
              <span className="text-muted small">
                {t('transactions.page')} {currentPage + 1} {t('transactions.of')} {totalPages}
              </span>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
                {t('transactions.next')} →
              </button>
            </nav>
          )}

          <TransactionList transactions={transactions} onDelete={handleDelete} />
        </section>
      </main>
    </>
  );
}