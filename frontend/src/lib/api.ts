const API_BASE = "http://localhost:8080/api";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      // Ignore non-JSON error responses.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export interface AuthResponse {
  userId: number;
  name: string;
  email: string;
}

export interface CategoryApi {
  id: number;
  name: string;
  type: "INCOME" | "EXPENSE";
}

export interface AccountApi {
  id: number;
  userId: number;
  accountName: string;
  accountType:
    | "SAVINGS"
    | "CHECKING"
    | "CREDIT_CARD"
    | "CASH"
    | "INVESTMENT"
    | "WALLET"
    | "OTHER";
  currentBalance: number;
  currency: string;
}

export interface TransactionApi {
  id: number;
  userId: number;
  accountId: number;
  categoryId: number;
  categoryName: string;
  paymentMethodId?: number;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string;
  description?: string;
  notes?: string;
}

export interface PaymentMethodApi {
  id: number;
  userId: number;
  methodName: string;
  details?: string;
  createdAt?: string;
}

export interface BudgetApi {
  id: number;
  userId: number;
  categoryId: number;
  categoryName: string;
  amount: number;
  month: number;
  year: number;
}

export interface DashboardApi {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  recentTransactions: Array<{
    id: number;
    date: string;
    description?: string;
    category: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
  }>;
}

export interface GoalApi {
  id: number;
  userId: number;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  status: "IN_PROGRESS" | "ACHIEVED" | "CANCELLED";
  createdAt?: string;
  updatedAt?: string;
}

export interface RecurringTransactionApi {
  id: number;
  userId: number;
  accountId: number;
  categoryId: number;
  paymentMethodId?: number;
  type: "INCOME" | "EXPENSE";
  amount: number;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
  startDate: string;
  endDate?: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const api = {
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  categories: () =>
    request<CategoryApi[]>("/categories"),

  accounts: (userId: number) =>
    request<AccountApi[]>(`/accounts?userId=${userId}`),

  createAccount: (input: {
    userId: number;
    accountName: string;
    accountType: AccountApi["accountType"];
    currentBalance: number;
    currency: string;
  }) =>
    request<AccountApi>("/accounts", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  transactions: (userId: number) =>
    request<TransactionApi[]>(`/transactions?userId=${userId}`),

  createTransaction: (input: {
    userId: number;
    accountId: number;
    categoryId: number;
    paymentMethodId?: number;
    type: "INCOME" | "EXPENSE";
    amount: number;
    transactionDate: string;
    description?: string;
    notes?: string;
  }) =>
    request<TransactionApi>("/transactions", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateTransaction: (
    id: number,
    input: {
      userId: number;
      accountId: number;
      categoryId: number;
      paymentMethodId?: number;
      type: "INCOME" | "EXPENSE";
      amount: number;
      transactionDate: string;
      description?: string;
      notes?: string;
    }
  ) =>
    request<TransactionApi>(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  deleteTransaction: (userId: number, id: number) =>
    request<void>(`/transactions/${id}?userId=${userId}`, {
      method: "DELETE",
    }),

  budgets: (userId: number) =>
    request<BudgetApi[]>(`/budgets?userId=${userId}`),

  createBudget: (input: {
    userId: number;
    categoryId: number;
    amount: number;
    month: number;
    year: number;
  }) =>
    request<BudgetApi>("/budgets", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateBudget: (
    id: number,
    input: {
      userId: number;
      categoryId: number;
      amount: number;
      month: number;
      year: number;
    }
  ) =>
    request<BudgetApi>(`/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  deleteBudget: (userId: number, id: number) =>
    request<void>(`/budgets/${id}?userId=${userId}`, {
      method: "DELETE",
    }),

  paymentMethods: (userId: number) =>
    request<PaymentMethodApi[]>(`/payment-methods?userId=${userId}`),

  dashboard: (userId: number) =>
    request<DashboardApi>(`/dashboard?userId=${userId}`),

  goals: (userId: number) =>
    request<GoalApi[]>(`/goals?userId=${userId}`),

  createGoal: (input: {
    userId: number;
    goalName: string;
    targetAmount: number;
    currentAmount: number;
    targetDate?: string;
    status: GoalApi["status"];
  }) =>
    request<GoalApi>("/goals", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateGoal: (
    id: number,
    input: {
      userId: number;
      goalName: string;
      targetAmount: number;
      currentAmount: number;
      targetDate?: string;
      status: GoalApi["status"];
    }
  ) =>
    request<GoalApi>(`/goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  deleteGoal: (userId: number, id: number) =>
    request<void>(`/goals/${id}?userId=${userId}`, {
      method: "DELETE",
    }),

  recurringTransactions: (userId: number) =>
    request<RecurringTransactionApi[]>(
      `/recurring-transactions?userId=${userId}`
    ),

  createRecurringTransaction: (input: {
    userId: number;
    accountId: number;
    categoryId: number;
    paymentMethodId?: number;
    type: "INCOME" | "EXPENSE";
    amount: number;
    frequency: RecurringTransactionApi["frequency"];
    startDate: string;
    endDate?: string;
    description?: string;
    isActive: boolean;
  }) =>
    request<RecurringTransactionApi>("/recurring-transactions", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateRecurringTransaction: (
    id: number,
    input: {
      userId: number;
      accountId: number;
      categoryId: number;
      paymentMethodId?: number;
      type: "INCOME" | "EXPENSE";
      amount: number;
      frequency: RecurringTransactionApi["frequency"];
      startDate: string;
      endDate?: string;
      description?: string;
      isActive: boolean;
    }
  ) =>
    request<RecurringTransactionApi>(`/recurring-transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  deleteRecurringTransaction: (userId: number, id: number) =>
    request<void>(`/recurring-transactions/${id}?userId=${userId}`, {
      method: "DELETE",
    }),
};
