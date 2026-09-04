import {
  useState,
  type FormEvent
} from 'react';
import { useTranslation } from 'react-i18next';

import type {
  CategoryType,
  CreateCategoryRequest
} from '../types/category';

interface CategoryFormProps {
  onCreate: (category: CreateCategoryRequest) => Promise<void>;
}

export default function CategoryForm({
  onCreate
}: CategoryFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>('EXPENSE');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onCreate({ name, type });
      setName('');
      setType('EXPENSE');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="row g-3 mt-1" onSubmit={handleSubmit}>
      <div className="col-md-5">
        <input
          type="text"
          className="form-control"
          placeholder={t('categories.namePlaceholder')}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className="col-md-3">
        <select className="form-select" value={type} onChange={(event) => setType(event.target.value as CategoryType)}>
          <option value="EXPENSE">{t('transactions.expense')}</option>
          <option value="INCOME">{t('transactions.income')}</option>
        </select>
      </div>
      <div className="col-md-4">
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? t('common.loading') : t('categories.addCategory')}
        </button>
      </div>
    </form>
  );
}