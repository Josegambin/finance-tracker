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

      <div className="text-center py-4">

        <span className="fs-1 d-block">
          💸
        </span>

        <h3 className="h5 mt-2">
          {t('transactions.noTransactions')}
        </h3>

        <p className="text-muted mb-0">
          {t('transactions.noTransactionsDescription')}
        </p>

      </div>

    );
  }

  return (

    <ul className="list-group list-group-flush">

      {transactions.map(
        transaction => (

          <li
            className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent"
            key={transaction.id}
          >

            <div className="d-flex align-items-center gap-3">

              <span
                className={
                  transaction.type === 'INCOME'
                    ? 'text-success fs-4'
                    : 'text-danger fs-4'
                }
              >
                {transaction.type === 'INCOME'
                  ? '↗'
                  : '↘'}

              </span>

              <div>

                <h3 className="h6 mb-0">
                  {transaction.description}
                </h3>

                <div className="text-muted small">

                  <span className="me-2">
                    {transaction.categoryName}
                  </span>

                  <span>
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

            <div className="d-flex align-items-center gap-2">

              <strong
                className={
                  transaction.type === 'INCOME'
                    ? 'text-success'
                    : 'text-danger'
                }
              >

                {transaction.type === 'INCOME'
                  ? '+'
                  : '-'}

                {transaction.amount.toFixed(2)} €

              </strong>

              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() =>
                  onDelete(transaction.id)
                }
                aria-label={`${t('common.delete')} ${transaction.description}`}
                title={t('common.delete')}
              >
                🗑
              </button>

            </div>

          </li>

        )
      )}

    </ul>

  );

}