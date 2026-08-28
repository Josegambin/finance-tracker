import {
  useState,
  type FormEvent
} from 'react';

import type {
  CategoryType,
  CreateCategoryRequest
} from '../types/category';

interface CategoryFormProps {

  onCreate: (
    category: CreateCategoryRequest
  ) => Promise<void>;

}

export default function CategoryForm({
  onCreate
}: CategoryFormProps) {

  const [name, setName] =
    useState('');

  const [type, setType] =
    useState<CategoryType>('EXPENSE');

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    setLoading(true);

    try {

      await onCreate({
        name,
        type
      });

      setName('');

      setType('EXPENSE');

    } finally {

      setLoading(false);
    }
  };

  return (
    <form
      className="category-form"
      onSubmit={handleSubmit}
    >

      <input
        type="text"
        placeholder="Category name"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
      />

      <select
        value={type}
        onChange={(event) =>
          setType(
            event.target.value as CategoryType
          )
        }
      >

        <option value="EXPENSE">
          Expense
        </option>

        <option value="INCOME">
          Income
        </option>

      </select>

      <button
        className="button button-primary"
        type="submit"
        disabled={loading}
      >

        {loading
          ? 'Adding...'
          : '+ Add category'}

      </button>

    </form>
  );
}