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
      <div className="text-center py-4">
        <span className="fs-1 d-block">📂</span>
        <h3 className="h5 mt-2">{t('categories.noCategories')}</h3>
        <p className="text-muted mb-0">{t('categories.noCategoriesDescription')}</p>
      </div>
    );
  }

  return (
    <ul className="list-group list-group-flush">
      {categories.map((category) => (
        <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent" key={category.id}>
          <div className="d-flex align-items-center gap-3">
            <span className={`fs-4 ${category.type === 'INCOME' ? 'text-success' : 'text-danger'}`}>
              {category.type === 'INCOME' ? '↗' : '↘'}
            </span>
            <div>
              <h3 className="h6 mb-1">{category.name}</h3>
              <span className={`badge ${category.type === 'INCOME' ? 'text-bg-success' : 'text-bg-danger'}`}>
                {category.type === 'INCOME' ? t('transactions.income') : t('transactions.expense')}
              </span>
            </div>
          </div>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(category.id)}
            title={t('common.delete')}
          >
            🗑
          </button>
        </li>
      ))}
    </ul>
  );
}