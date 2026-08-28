export type CategoryType =
  | 'INCOME'
  | 'EXPENSE';

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
}

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
}