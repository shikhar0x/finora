export type CategoryType = "EXPENSE" | "INCOME";

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
}

export type NewCategoryInput = Omit<Category, "id">;
