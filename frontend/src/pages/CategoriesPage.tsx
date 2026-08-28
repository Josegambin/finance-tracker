import { useEffect, useState } from 'react';
import { createCategory, deleteCategory, getCategories } from '../api/categoryApi';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';
import type { Category, CreateCategoryRequest } from '../types/category';
import Navbar from '../components/Navbar';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (category: CreateCategoryRequest) => {
    const newCategory = await createCategory(category);
    setCategories((current) => [...current, newCategory]);
  };

  const handleDelete = async (id: number) => {
    await deleteCategory(id);
    setCategories((current) => current.filter((cat) => cat.id !== id));
  };

  if (loading) {
    return <p>Loading categories...</p>;
  }

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="page-header">
          <div>
            <p className="eyebrow">FINANCE MANAGEMENT</p>
            <h1>Categories</h1>
            <p className="page-description">Organize your income and expenses.</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <section className="content-card">
          <h2>Create category</h2>
          <CategoryForm onCreate={handleCreate} />
        </section>

        <section className="content-card">
          <div className="section-header">
            <div>
              <h2>Your categories</h2>
              <p>{categories.length} categories</p>
            </div>
          </div>
          <CategoryList categories={categories} onDelete={handleDelete} />
        </section>
      </main>
    </>
  );
}