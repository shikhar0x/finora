export interface Category {
  id: number;
  name: string;
  type: "EXPENSE" | "INCOME" | "BOTH";
  icon?: string;
  color?: string;
}
