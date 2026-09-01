import type {
  Category
} from '../types/category';

import type {
  TransactionType
} from '../types/transaction';

interface TransactionFiltersProps {

  search: string;

  type: TransactionType | 'ALL';

  categoryId: number | 'ALL';

  month: string;

  sort: string;

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

  onSortChange: (
    value: string
  ) => void;

}

export default function TransactionFilters({

  search,
  type,
  categoryId,
  month,
  sort,

  categories,
  months,

  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onMonthChange,
  onSortChange

}: TransactionFiltersProps) {

  return (

    <div className="transaction-filters">

      {/* SEARCH */}

      <div className="filter-group search-filter">

        <label htmlFor="transaction-search">
          Search
        </label>

        <input
          id="transaction-search"
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

        <label htmlFor="transaction-type">
          Type
        </label>

        <select
          id="transaction-type"
          value={type}
          onChange={(event) =>
            onTypeChange(
              event.target.value as
              TransactionType | 'ALL'
            )
          }
        >

          <option value="ALL">
            All types
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

        <label htmlFor="transaction-category">
          Category
        </label>

        <select
          id="transaction-category"
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

        <label htmlFor="transaction-month">
          Month
        </label>

        <select
          id="transaction-month"
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
                {currentMonth}
              </option>

            )
          )}

        </select>

      </div>


      {/* SORT */}

      <div className="filter-group sort-filter">

        <label htmlFor="transaction-sort">
          Sort by
        </label>

        <select
          id="transaction-sort"
          value={sort}
          onChange={(event) => {

            onSortChange(
              event.target.value
            );

          }}
        >

          <option value="date,desc">
            Date — Newest first
          </option>

          <option value="date,asc">
            Date — Oldest first
          </option>

          <option value="amount,desc">
            Amount — Highest first
          </option>

          <option value="amount,asc">
            Amount — Lowest first
          </option>

          <option value="description,asc">
            Description — A → Z
          </option>

          <option value="description,desc">
            Description — Z → A
          </option>

        </select>

      </div>

    </div>

  );

}