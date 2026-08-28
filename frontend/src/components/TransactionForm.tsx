import {
  useEffect,
  useState
} from 'react';

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

  /*
   * Solo mostramos categorías
   * compatibles con el tipo.
   */

  const filteredCategories =
    categories.filter(
      category => category.type === type
    );

  /*
   * Cuando cambia el tipo,
   * seleccionamos automáticamente
   * la primera categoría compatible.
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

      /*
       * Limpiamos el formulario
       * después de crear.
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
      className="transaction-form"
      onSubmit={handleSubmit}
    >

      <div className="form-group description-field">

        <label>
          Description
        </label>

        <input
          type="text"
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

      <div className="form-group amount-field">

        <label>
          Amount
        </label>

        <input
          type="number"
          step="0.01"
          min="0.01"
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

      <div className="form-group date-field">

        <label>
          Date
        </label>

        <input
          type="date"
          value={date}
          onChange={(event) =>
            setDate(
              event.target.value
            )
          }
          required
        />

      </div>

      <div className="form-group">

        <label>
          Type
        </label>

        <select
          value={type}
          onChange={(event) =>
            setType(
              event.target.value as TransactionType
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

      </div>

      <div className="form-group category-field">

        <label>
          Category
        </label>

        <select
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
              No categories available
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

      <button
        type="submit"
        className="primary-button"
        disabled={
          loading ||
          !categoryId
        }
      >

        {loading
          ? 'Adding...'
          : '+ Add transaction'}

      </button>

    </form>
  );
}