import {
  useState
} from 'react';

import type {
  Category
} from '../types/category';

import type {
  CreateBudgetRequest
} from '../types/budget';

interface BudgetFormProps {
  categories: Category[];
  onCreate: (
    request: CreateBudgetRequest
  ) => Promise<void>;
}

export default function BudgetForm({
  categories,
  onCreate
}: BudgetFormProps) {

  const expenseCategories =
    categories.filter(
      category =>
        category.type === 'EXPENSE'
    );

  const [categoryId, setCategoryId] =
    useState('');

  const [month, setMonth] =
    useState('');

  const [amount, setAmount] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    if (
      !categoryId ||
      !month ||
      !amount
    ) {
      return;
    }

    try {

      setLoading(true);

      await onCreate({

        categoryId:
          Number(categoryId),

        month,

        amount:
          Number(amount)

      });

      setCategoryId('');
      setMonth('');
      setAmount('');

    } finally {

      setLoading(false);
    }
  };

  return (

    <form
      className="budget-form"
      onSubmit={handleSubmit}
    >

      <div className="form-group">

        <label>
          Category
        </label>

        <select
          value={categoryId}
          onChange={event =>
            setCategoryId(
              event.target.value
            )
          }
        >

          <option value="">
            Select category
          </option>

          {expenseCategories.map(
            category => (

              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>

            )
          )}

        </select>

      </div>

      <div className="form-group">

        <label>
          Month
        </label>

        <input
          type="month"
          value={month}
          onChange={event =>
            setMonth(
              event.target.value
            )
          }
        />

      </div>

      <div className="form-group">

        <label>
          Amount
        </label>

        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="400.00"
          value={amount}
          onChange={event =>
            setAmount(
              event.target.value
            )
          }
        />

      </div>

      <button
        type="submit"
        className="primary-button"
        disabled={loading}
      >

        {loading
          ? 'Creating...'
          : '+ Create budget'}

      </button>

    </form>
  );
}