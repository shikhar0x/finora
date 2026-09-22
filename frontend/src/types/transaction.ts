export type TransactionType = "INCOME" | "EXPENSE";

export type PaymentMethod = "UPI" | "Cash" | "Card" | "Bank Transfer" | "Other";

export interface Transaction {
  id: number;
  date: string; // ISO format YYYY-MM-DD
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod | string;
  notes?: string;
  createdAt?: string;
}

export type NewTransactionInput = Omit<Transaction, "id" | "createdAt">;
