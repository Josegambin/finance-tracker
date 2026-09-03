/**
 * The kind of movements a category can be associated with.
 */
export type CategoryType =
  | 'INCOME'
  | 'EXPENSE';

/**
 * A classification label used to group transactions.
 */
export interface Category {
  /** Unique identifier of the category. */
  id: number;
  /** Display name of the category (e.g. "Groceries"). */
  name: string;
  /** Whether the category applies to incomes or expenses. */
  type: CategoryType;
}

/**
 * Payload used to create a new category.
 */
export interface CreateCategoryRequest {
  /** Display name of the category. */
  name: string;
  /** Whether the category applies to incomes or expenses. */
  type: CategoryType;
}