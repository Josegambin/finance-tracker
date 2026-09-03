import type { Transaction } from './transaction';

/**
 * Summary data displayed on the dashboard.
 */
export interface Dashboard {
  /** Current balance (total income minus expenses). */
  balance: number;
  /** Sum of all incomes. */
  totalIncome: number;
  /** Sum of all expenses. */
  totalExpenses: number;
  /** Latest transactions, used to fill the recent activity list. */
  recentTransactions: Transaction[];
}