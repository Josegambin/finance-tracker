/**
 * A monthly budget assigned to a category, including spending progress.
 */
export interface Budget {
  /** Unique identifier of the budget. */
  id: number;
  /** Identifier of the category the budget applies to. */
  categoryId: number;
  /** Display name of the budgeted category. */
  categoryName: string;
  /** Month the budget applies to, in yyyy-MM format. */
  month: string;
  /** Amount allocated to the budget. */
  budgetAmount: number;
  /** Amount already spent against the budget during the month. */
  spentAmount: number;
  /** Amount left to spend (budgetAmount - spentAmount). */
  remainingAmount: number;
  /** Percentage of the budget that has been used (0-100+). */
  percentageUsed: number;
}

/**
 * Payload used to create a new budget.
 */
export interface CreateBudgetRequest {
  /** Identifier of the category to budget for. */
  categoryId: number;
  /** Month the budget applies to, in yyyy-MM format. */
  month: string;
  /** Amount to allocate to the budget. */
  amount: number;
}