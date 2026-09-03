import { useTranslation } from 'react-i18next';
import type { Transaction } from '../types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: number) => Promise<void>;
}

export default function TransactionList({
  transactions,
  onDelete
}: TransactionListProps) {

  const { t } = useTranslation();

  if (transactions.length === 0) {

    return (

      <div className="empty-state">

        <span className="empty-state-icon">
          💸
        </span>

        <h3>
          {t('transactions.noTransactions')}
        </h3>

        <p>
          {t('transactions.noTransactionsDescription')}
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

              <div className="transaction-details">

                <h3>
                  {transaction.description}
                </h3>

                <div className="transaction-meta">

                  <span className="transaction-category">
                    {transaction.categoryName}
                  </span>

                  <span className="transaction-date">
                    {new Date(
                      transaction.date
                    ).toLocaleDateString(
                      'es-ES',
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }
                    )}
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
                type="button"
                className="delete-button"
                onClick={() =>
                  onDelete(transaction.id)
                }
                aria-label={`${t('common.delete')} ${transaction.description}`}
                title={t('common.delete')}
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