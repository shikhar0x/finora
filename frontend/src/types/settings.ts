export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

export type DateFormatOption = "DD MMM YYYY" | "YYYY-MM-DD" | "DD/MM/YYYY" | "MM/DD/YYYY";

export interface UserProfile {
  name: string;
  email: string;
  avatarText: string;
  role: string;
}

export interface UserPreferences {
  currency: CurrencyCode;
  currencySymbol: string;
  dateFormat: DateFormatOption;
  defaultTransactionType: "EXPENSE" | "INCOME";
  theme: "light" | "dark" | "system";
  emailAlerts: boolean;
  budgetAlerts: boolean;
}
