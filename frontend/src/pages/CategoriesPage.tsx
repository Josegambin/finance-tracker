import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createCategory, deleteCategory, getCategories } from '../api/categoryApi';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';
import type { Category, CreateCategoryRequest } from '../types/category';
import Navbar from '../components/Navbar';

export default function CategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const handleCreate = async (category: CreateCategoryRequest) => {
    try {
      const newCategory = await createCategory(category);
      setCategories((current) => [...current, newCategory]);
       setSuccess(null);
      const message = t('categories.created');
      setSuccess(message);
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.errorCreating'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories((current) => current.filter((cat) => cat.id !== id));
       setSuccess(null);
      const message = t('categories.deleted');
      setSuccess(message);
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.errorDeleting'));
    }
  };

  if (loading) {
    return <p className="container py-4">{t('common.loading')}</p>;
  }

  return (
    <>
      <Navbar />
      <main className="container py-4">
        <div className="mb-4">
          <p className="text-muted small text-uppercase mb-0">{t('transactions.financeManagement')}</p>
          <h1 className="h2 mb-1">{t('categories.title')}</h1>
          <p className="text-muted mb-0">{t('categories.description')}</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <section className="card mb-4 p-3">
          <h2 className="h5">{t('categories.addCategory')}</h2>
          <CategoryForm onCreate={handleCreate} />
        </section>

        <section className="card p-3">
          <div className="mb-3">
            <h2 className="h5 mb-0">{t('categories.yourCategories')}</h2>
            <p className="text-muted small mb-0">{t('categories.count', { count: categories.length })}</p>
          </div>
          <CategoryList categories={categories} onDelete={handleDelete} />
        </section>
      </main>
    </>
  );
}