import { TransactionType } from "./transaction";

export type RecurringFrequency =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY";

export interface RecurringTransaction {
  id: number;
  userId: number;
  accountId: number;
  categoryId: number;
  paymentMethodId?: number;
  type: TransactionType;
  amount: number;
  frequency: RecurringFrequency;
  startDate: string;
  endDate?: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type NewRecurringTransactionInput = Omit<
  RecurringTransaction,
  "id" | "createdAt" | "updatedAt"
>;
