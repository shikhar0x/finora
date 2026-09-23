export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  id: number;
  userId: number;
  accountId: number;
  categoryId: number;
  paymentMethodId?: number;
  type: TransactionType;
  amount: number;
  date: string; // ISO format YYYY-MM-DD
  description?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NewTransactionInput = Omit<
  Transaction,
  "id" | "createdAt" | "updatedAt"
>;
