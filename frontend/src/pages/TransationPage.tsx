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

  const debouncedSearch = useDebounce(search, 400);

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
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.errorCreating'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      await loadData();
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.errorDeleting'));
    }
  };

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      setError(null);
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
        <main className="page-container">
          <p>{t('transactions.loading')}</p>
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
            <p className="eyebrow">{t('transactions.financeManagement')}</p>
            <h1>{t('transactions.title')}</h1>
            <p className="page-description">{t('transactions.description')}</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <section className="content-card">
          <h2>{t('transactions.addTransaction')}</h2>
          <TransactionForm categories={categories} onCreate={handleCreate} />
        </section>

        <section className="content-card">
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

          <div className="section-header">
            <div>
              <h2>{t('transactions.yourTransactions')}</h2>
              <p>{t('transactions.transactionsCount', { count: totalElements })}</p>
            </div>
            <div>
              <button type="button" onClick={handleExportCsv} disabled={exporting}>
                {exporting ? `⏳ ${t('transactions.exporting')}` : `📥 ${t('transactions.exportCsv')}`}
              </button>
              <button type="button" onClick={clearFilters}>
                {t('transactions.clearFilters')}
              </button>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button type="button" onClick={goToPreviousPage} disabled={currentPage === 0}>
                ← {t('transactions.previous')}
              </button>
              <span>
                {t('transactions.page')} {currentPage + 1} {t('transactions.of')} {totalPages}
              </span>
              <button type="button" onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
                {t('transactions.next')} →
              </button>
            </div>
          )}

          <TransactionList transactions={transactions} onDelete={handleDelete} />
        </section>
      </main>
    </>
  );
}