import type {
  Transaction
} from '../types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (
    id: number
  ) => Promise<void>;
}

export default function TransactionList({
  transactions,
  onDelete
}: TransactionListProps) {

  if (transactions.length === 0) {

    return (

      <div className="empty-state">

        <span>
          💸
        </span>

        <h3>
          No transactions yet
        </h3>

        <p>
          Add your first income or expense
          to start tracking your finances.
        </p>

      </div>

    );
  }

  return (

    <div className="transaction-list">

      {transactions.map(
        transaction => (

          <div
            className="transaction-card"
            key={transaction.id}
          >

            <div className="transaction-info">

              <div
                className={
                  transaction.type === 'INCOME'
                    ? 'transaction-icon income'
                    : 'transaction-icon expense'
                }
              >

                {transaction.type === 'INCOME'
                  ? '↗'
                  : '↘'}

              </div>

              <div>

                <h3>
                  {transaction.description}
                </h3>

                <div className="transaction-meta">

                  <span>
                    {transaction.categoryName}
                  </span>

                  <span>
                    {transaction.date}
                  </span>

                </div>

              </div>

            </div>

            <div className="transaction-actions">

              <strong
                className={
                  transaction.type === 'INCOME'
                    ? 'amount income'
                    : 'amount expense'
                }
              >

                {transaction.type === 'INCOME'
                  ? '+'
                  : '-'}

                {transaction.amount.toFixed(2)} €

              </strong>

              <button
                className="delete-button"
                onClick={() =>
                  onDelete(transaction.id)
                }
              >
                🗑
              </button>

            </div>

          </div>

        )
      )}

    </div>
  );
}