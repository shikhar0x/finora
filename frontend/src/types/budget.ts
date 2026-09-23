export interface Budget {
  id: number;
  userId: number;
  categoryId: number;
  limit: number;
  month: number; // 1 - 12
  year: number;
  createdAt?: string;
  updatedAt?: string;
}

export type NewBudgetInput = Omit<Budget, "id" | "createdAt" | "updatedAt">;
