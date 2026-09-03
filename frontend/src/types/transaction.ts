/**
 * The kind of financial movement a transaction represents.
 */
export type TransactionType =
  | 'INCOME'
  | 'EXPENSE';

/**
 * A single financial transaction (income or expense) recorded by the user.
 */
export interface Transaction {
  /** Unique identifier of the transaction. */
  id: number;

  /** Human-readable description of the transaction. */
  description: string;

  /** Monetary amount of the transaction (always positive). */
  amount: number;

  /** ISO date (yyyy-MM-dd) on which the transaction occurred. */
  date: string;

  /** Whether the transaction is an income or an expense. */
  type: TransactionType;

  /** Identifier of the category this transaction belongs to. */
  categoryId: number;

  /** Display name of the transaction's category. */
  categoryName: string;
}

/**
 * Payload used to create a new transaction.
 */
export interface CreateTransactionRequest {
  /** Human-readable description of the transaction. */
  description: string;
  /** Monetary amount of the transaction (always positive). */
  amount: number;
  /** ISO date (yyyy-MM-dd) on which the transaction occurred. */
  date: string;
  /** Whether the transaction is an income or an expense. */
  type: TransactionType;
  /** Identifier of the category this transaction belongs to. */
  categoryId: number;
}

/**
 * Paginated response returned by the transactions API.
 */
export interface TransactionPageResponse {
  /** The transactions belonging to the requested page. */
  content: Transaction[];
  /** Total number of transactions across all pages. */
  totalElements: number;
  /** Total number of pages available. */
  totalPages: number;
  /** Zero-based index of the current page. */
  number: number;
  /** Number of items per page. */
  size: number;
}