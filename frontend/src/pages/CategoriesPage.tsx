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
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.errorCreating'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories((current) => current.filter((cat) => cat.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.errorDeleting'));
    }
  };

  if (loading) {
    return <p>{t('common.loading')}</p>;
  }

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="page-header">
          <div>
            <p className="eyebrow">{t('transactions.financeManagement')}</p>
            <h1>{t('categories.title')}</h1>
            <p className="page-description">{t('categories.description')}</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <section className="content-card">
          <h2>{t('categories.addCategory')}</h2>
          <CategoryForm onCreate={handleCreate} />
        </section>

        <section className="content-card">
          <div className="section-header">
            <div>
              <h2>{t('categories.yourCategories')}</h2>
              <p>{t('categories.count', { count: categories.length })}</p>
            </div>
          </div>
          <CategoryList categories={categories} onDelete={handleDelete} />
        </section>
      </main>
    </>
  );
}