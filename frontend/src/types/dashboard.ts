import type { Transaction } from './transaction';

export interface Dashboard {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  recentTransactions: Transaction[];
}