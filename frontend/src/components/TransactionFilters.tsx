import type {
  TransactionType
} from '../types/transaction';

import type {
  Category
} from '../types/category';


interface TransactionFiltersProps {

  search: string;

  type: TransactionType | 'ALL';

  categoryId: number | 'ALL';

  month: string;

  categories: Category[];

  months: string[];

  onSearchChange: (
    value: string
  ) => void;

  onTypeChange: (
    value: TransactionType | 'ALL'
  ) => void;

  onCategoryChange: (
    value: number | 'ALL'
  ) => void;

  onMonthChange: (
    value: string
  ) => void;
}


export default function TransactionFilters({

  search,

  type,

  categoryId,

  month,

  categories,

  months,

  onSearchChange,

  onTypeChange,

  onCategoryChange,

  onMonthChange

}: TransactionFiltersProps) {


  return (

    <div className="transaction-filters">


      {/* SEARCH */}

      <div className="filter-group">

        <label htmlFor="search">
          Search
        </label>

        <input
          id="search"
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(event) =>
            onSearchChange(
              event.target.value
            )
          }
        />

      </div>


      {/* TYPE */}

      <div className="filter-group">

        <label htmlFor="type">
          Type
        </label>

        <select
          id="type"
          value={type}
          onChange={(event) =>
            onTypeChange(
              event.target.value as
                TransactionType | 'ALL'
            )
          }
        >

          <option value="ALL">
            All
          </option>

          <option value="INCOME">
            Income
          </option>

          <option value="EXPENSE">
            Expense
          </option>

        </select>

      </div>


      {/* CATEGORY */}

      <div className="filter-group">

        <label htmlFor="category">
          Category
        </label>

        <select
          id="category"
          value={categoryId}
          onChange={(event) => {

            const value =
              event.target.value;

            onCategoryChange(
              value === 'ALL'
                ? 'ALL'
                : Number(value)
            );

          }}
        >

          <option value="ALL">
            All categories
          </option>


          {categories.map(
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


      {/* MONTH */}

      <div className="filter-group">

        <label htmlFor="month">
          Month
        </label>

        <select
          id="month"
          value={month}
          onChange={(event) =>
            onMonthChange(
              event.target.value
            )
          }
        >

          <option value="ALL">
            All months
          </option>


          {months.map(
            currentMonth => (

              <option
                key={currentMonth}
                value={currentMonth}
              >

                {formatMonth(
                  currentMonth
                )}

              </option>

            )
          )}

        </select>

      </div>


    </div>

  );
}


/**
 * Converts:
 *
 * 2026-08
 *
 * into:
 *
 * August 2026
 */
function formatMonth(
  month: string
): string {

  const [
    year,
    monthNumber
  ] = month.split('-');

  const date =
    new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    );

  return date.toLocaleDateString(
    'en-US',
    {
      month: 'long',
      year: 'numeric'
    }
  );
}