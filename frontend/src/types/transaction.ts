export type TransactionType =
  | 'INCOME'
  | 'EXPENSE';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: number;
  categoryName: string;
}

export interface CreateTransactionRequest {
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: number;
}