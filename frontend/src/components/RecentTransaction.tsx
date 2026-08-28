import type {
  Transaction
} from '../types/transaction';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({
  transactions
}: RecentTransactionsProps) {

  if (transactions.length === 0) {

    return (

      <div className="empty-state">

        <span>
          📊
        </span>

        <h3>
          No transactions yet
        </h3>

        <p>
          Add your first transaction
          to see your financial summary.
        </p>

      </div>

    );
  }

  const formatAmount = (
    amount: number
  ) => {

    return new Intl.NumberFormat(
      'es-ES',
      {
        style: 'currency',
        currency: 'EUR'
      }
    ).format(amount);
  };

  return (

    <div className="recent-transactions">

      {transactions.map(
        transaction => (

          <div
            className="recent-transaction"
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

              {formatAmount(
                transaction.amount
              )}

            </strong>

          </div>

        )
      )}

    </div>
  );
}