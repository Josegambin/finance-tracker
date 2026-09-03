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
    <form className="category-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={t('categories.namePlaceholder')}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <select value={type} onChange={(event) => setType(event.target.value as CategoryType)}>
        <option value="EXPENSE">{t('transactions.expense')}</option>
        <option value="INCOME">{t('transactions.income')}</option>
      </select>
      <button className="button button-primary" type="submit" disabled={loading}>
        {loading ? t('common.loading') : t('categories.addCategory')}
      </button>
    </form>
  );
}