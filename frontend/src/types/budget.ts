export interface Budget {
  id: number;
  categoryId: number;
  categoryName: string;
  month: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
}

export interface CreateBudgetRequest {
  categoryId: number;
  month: string;
  amount: number;
}