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

export interface TransactionPageResponse {

  content: Transaction[];

  totalElements: number;

  totalPages: number;

  number: number;

  size: number;

}