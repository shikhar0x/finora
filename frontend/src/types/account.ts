export type AccountType =
  | "SAVINGS"
  | "CHECKING"
  | "CREDIT_CARD"
  | "CASH"
  | "INVESTMENT"
  | "WALLET"
  | "OTHER";

export interface Account {
  id: number;
  userId: number;
  accountName: string;
  accountType: AccountType;
  currentBalance: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NewAccountInput = Omit<Account, "id" | "createdAt" | "updatedAt">;
