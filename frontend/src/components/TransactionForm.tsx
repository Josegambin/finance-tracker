import {
  useEffect,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';

import type {
  Category
} from '../types/category';

import type {
  CreateTransactionRequest,
  TransactionType
} from '../types/transaction';

interface TransactionFormProps {
  categories: Category[];
  onCreate: (
    transaction: CreateTransactionRequest
  ) => Promise<void>;
}

export default function TransactionForm({
  categories,
  onCreate
}: TransactionFormProps) {

  const { t } = useTranslation();

  const [description, setDescription] =
    useState('');

  const [amount, setAmount] =
    useState('');

  const [date, setDate] =
    useState('');

  const [type, setType] =
    useState<TransactionType>('EXPENSE');

  const [categoryId, setCategoryId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(false);

  /**
   * Only categories compatible with the
   * selected transaction type are shown.
   */

  const filteredCategories =
    categories.filter(
      category => category.type === type
    );

  /**
   * When the transaction type changes,
   * the first compatible category
   * is automatically selected.
   */

  useEffect(() => {

    if (filteredCategories.length > 0) {

      setCategoryId(
        filteredCategories[0].id
      );

    } else {

      setCategoryId(null);
    }

  }, [type, categories]);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    if (!categoryId) {
      return;
    }

    try {

      setLoading(true);

      await onCreate({
        description,
        amount: Number(amount),
        date,
        type,
        categoryId
      });

      /**
       * Clears the form after the transaction is created.
       */

      setDescription('');
      setAmount('');
      setDate('');

    } finally {

      setLoading(false);
    }
  };

  return (

    <form
      className="row g-3 mt-1"
      onSubmit={handleSubmit}
    >

      <div className="col-md-6">

        <label className="form-label">
          {t('transactions.description')}
        </label>

        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
          placeholder="Example: Mercadona"
          required
        />

      </div>

      <div className="col-md-3">

        <label className="form-label">
          {t('transactions.amount')}
        </label>

        <input
          type="number"
          step="0.01"
          min="0.01"
          className="form-control"
          value={amount}
          onChange={(event) =>
            setAmount(
              event.target.value
            )
          }
          placeholder="0.00"
          required
        />

      </div>

      <div className="col-md-3">

        <label className="form-label">
          {t('transactions.date')}
        </label>

        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(event) =>
            setDate(
              event.target.value
            )
          }
          required
        />

      </div>

      <div className="col-md-4">

        <label className="form-label">
          {t('transactions.type')}
        </label>

        <select
          className="form-select"
          value={type}
          onChange={(event) =>
            setType(
              event.target.value as TransactionType
            )
          }
        >

          <option value="EXPENSE">
            {t('transactions.expense')}
          </option>

          <option value="INCOME">
            {t('transactions.income')}
          </option>

        </select>

      </div>

      <div className="col-md-4">

        <label className="form-label">
          {t('transactions.category')}
        </label>

        <select
          className="form-select"
          value={categoryId ?? ''}
          onChange={(event) =>
            setCategoryId(
              Number(event.target.value)
            )
          }
          disabled={
            filteredCategories.length === 0
          }
        >

          {filteredCategories.length === 0 && (
            <option value="">
              {t('transactions.noCategoriesAvailable')}
            </option>
          )}

          {filteredCategories.map(
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

      <div className="col-md-4 d-flex align-items-end">

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={
            loading ||
            !categoryId
          }
        >

          {loading
            ? t('common.loading')
            : t('transactions.addTransaction')}

        </button>

      </div>

    </form>
  );
}