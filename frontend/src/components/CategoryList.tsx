import { useTranslation } from 'react-i18next';
import type { Category } from '../types/category';

interface CategoryListProps {
  categories: Category[];
  onDelete: (id: number) => Promise<void>;
}

export default function CategoryList({
  categories,
  onDelete
}: CategoryListProps) {
  const { t } = useTranslation();

  if (categories.length === 0) {
    return (
      <div className="empty-state">
        <span>📂</span>
        <h3>{t('categories.noCategories')}</h3>
        <p>{t('categories.noCategoriesDescription')}</p>
      </div>
    );
  }

  return (
    <div className="category-list">
      {categories.map((category) => (
        <div className="category-card" key={category.id}>
          <div className="category-info">
            <div className={category.type === 'INCOME' ? 'category-icon income' : 'category-icon expense'}>
              {category.type === 'INCOME' ? '↗' : '↘'}
            </div>
            <div>
              <h3>{category.name}</h3>
              <span className={category.type === 'INCOME' ? 'badge income' : 'badge expense'}>
                {category.type === 'INCOME' ? t('transactions.income') : t('transactions.expense')}
              </span>
            </div>
          </div>
          <button
            className="delete-button"
            onClick={() => onDelete(category.id)}
            title={t('common.delete')}
          >
            🗑
          </button>
        </div>
      ))}
    </div>
  );
}