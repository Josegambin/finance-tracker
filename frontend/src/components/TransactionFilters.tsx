import type { TransactionType } from '../types/transaction';

interface TransactionFiltersProps {
  search: string;
  type: TransactionType | 'ALL';
  onSearchChange: (value: string) => void;
  onTypeChange: (value: TransactionType | 'ALL') => void;
}

export default function TransactionFilters({
  search,
  type,
  onSearchChange,
  onTypeChange
}: TransactionFiltersProps) {

  return (
    <div className="transaction-filters">

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

    </div>
  );
}