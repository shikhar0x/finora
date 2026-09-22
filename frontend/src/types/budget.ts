export interface Budget {
  id: number;
  category: string;
  limit: number;
  month: number; // 1 - 12
  year: number;
}

export type NewBudgetInput = Omit<Budget, "id">;
