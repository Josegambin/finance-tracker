import type {
  Category
} from '../types/category';

import type {
  TransactionType
} from '../types/transaction';

import {
  useTranslation
} from 'react-i18next';


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

  const {
    t
  } = useTranslation();


  return (

    <div className="row g-3 mb-3">

      {/* SEARCH */}

      <div className="col-md-4">

        <label htmlFor="transaction-search" className="form-label">

          {t(
            'transactions.search'
          )}

        </label>

        <input
          id="transaction-search"

          type="text"

          className="form-control"

          placeholder={
            t(
              'transactions.searchPlaceholder'
            )
          }

          value={search}

          onChange={(event) =>
            onSearchChange(
              event.target.value
            )
          }

        />

      </div>

      {/* TYPE */}

      <div className="col-md-4">

        <label htmlFor="transaction-type" className="form-label">

          {t(
            'transactions.type'
          )}

        </label>

        <select
          id="transaction-type"

          className="form-select"

          value={type}

          onChange={(event) => {

            onTypeChange(

              event.target.value as
                TransactionType | 'ALL'

            );

          }}

        >

          <option value="ALL">

            {t(
              'transactions.allTypes'
            )}

          </option>

          <option value="INCOME">

            {t(
              'transactions.income'
            )}

          </option>

          <option value="EXPENSE">

            {t(
              'transactions.expense'
            )}

          </option>

        </select>

      </div>

      {/* CATEGORY */}

      <div className="col-md-4">

        <label htmlFor="transaction-category" className="form-label">

          {t(
            'transactions.category'
          )}

        </label>

        <select
          id="transaction-category"

          className="form-select"

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

            {t(
              'transactions.allCategories'
            )}

          </option>

          {categories.map(
            category => (

              <option
                key={
                  category.id
                }

                value={
                  category.id
                }

              >

                {category.name}

              </option>

            )
          )}

        </select>

      </div>

      {/* MONTH */}

      <div className="col-md-6">

        <label htmlFor="transaction-month" className="form-label">

          {t(
            'transactions.month'
          )}

        </label>

        <select
          id="transaction-month"

          className="form-select"

          value={month}

          onChange={(event) =>
            onMonthChange(
              event.target.value
            )
          }

        >

          <option value="ALL">

            {t(
              'transactions.allMonths'
            )}

          </option>

          {months.map(
            currentMonth => (

              <option
                key={
                  currentMonth
                }

                value={
                  currentMonth
                }

              >

                {currentMonth}

              </option>

            )
          )}

        </select>

      </div>

      {/* SORT */}

      <div className="col-md-6">

        <label htmlFor="transaction-sort" className="form-label">

          {t(
            'transactions.sortBy'
          )}

        </label>

        <select
          id="transaction-sort"

          className="form-select"

          value={sort}

          onChange={(event) => {

            onSortChange(
              event.target.value
            );

          }}

        >

          <option value="date,desc">

            {t(
              'transactions.newestFirst'
            )}

          </option>

          <option value="date,asc">

            {t(
              'transactions.oldestFirst'
            )}

          </option>

          <option value="amount,desc">

            {t(
              'transactions.highestAmount'
            )}

          </option>

          <option value="amount,asc">

            {t(
              'transactions.lowestAmount'
            )}

          </option>

          <option value="description,asc">

            {t(
              'transactions.descriptionAZ'
            )}

          </option>

          <option value="description,desc">

            {t(
              'transactions.descriptionZA'
            )}

          </option>

        </select>

      </div>

    </div>

  );

}