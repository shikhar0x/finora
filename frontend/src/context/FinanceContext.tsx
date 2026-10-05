import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { Transaction, NewTransactionInput } from "../types/transaction";
import type { Budget, NewBudgetInput } from "../types/budget";
import type { Category } from "../types/category";
import type { Account, NewAccountInput } from "../types/account";
import type { PaymentMethod, NewPaymentMethodInput } from "../types/paymentMethod";
import type { Goal, NewGoalInput } from "../types/goal";
import type {
  RecurringTransaction,
  NewRecurringTransactionInput,
} from "../types/recurringTransaction";
import type { UserProfile, UserPreferences } from "../types/settings";
import {
  initialCategories,
  initialPaymentMethods,
  initialGoals,
  initialRecurringTransactions,
  initialUserProfile,
  initialPreferences,
} from "../data/mockData";
import { api } from "../lib/api";

export interface CategoryExpense {
  name: string;
  categoryId: number;
  value: number;
  percentage: number;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  monthNumber: number;
  income: number;
  expenses: number;
  savings: number;
}

export interface BudgetProgressItem {
  id: number;
  categoryId: number;
  category: string;
  color: string;
  spent: number;
  limit: number;
  remaining: number;
  percentage: number;
  month: number;
  year: number;
}

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  accounts: Account[];
  paymentMethods: PaymentMethod[];
  goals: Goal[];
  recurringTransactions: RecurringTransaction[];
  userProfile: UserProfile;
  preferences: UserPreferences;

  addTransaction: (input: NewTransactionInput) => Transaction;
  updateTransaction: (id: number, input: Partial<NewTransactionInput>) => void;
  deleteTransaction: (id: number) => void;

  addBudget: (input: NewBudgetInput) => Budget;
  updateBudget: (id: number, input: Partial<NewBudgetInput>) => void;
  deleteBudget: (id: number) => void;

  addAccount: (input: NewAccountInput) => Account;
  updateAccount: (id: number, input: Partial<NewAccountInput>) => void;
  deleteAccount: (id: number) => void;

  addPaymentMethod: (input: NewPaymentMethodInput) => PaymentMethod;
  updatePaymentMethod: (id: number, input: Partial<NewPaymentMethodInput>) => void;
  deletePaymentMethod: (id: number) => void;

  addGoal: (input: NewGoalInput) => Goal;
  updateGoal: (id: number, input: Partial<NewGoalInput>) => void;
  deleteGoal: (id: number) => void;

  addRecurringTransaction: (
    input: NewRecurringTransactionInput
  ) => RecurringTransaction;
  updateRecurringTransaction: (
    id: number,
    input: Partial<NewRecurringTransactionInput>
  ) => void;
  deleteRecurringTransaction: (id: number) => void;
  toggleRecurringTransaction: (id: number) => void;

  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  resetDataToDefault: () => void;

  getAccountById: (id?: number) => Account | undefined;
  getCategoryById: (id?: number) => Category | undefined;
  getPaymentMethodById: (id?: number) => PaymentMethod | undefined;

  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  totalSavings: number;
  savingsRate: number;
  categoryExpenses: CategoryExpense[];
  monthlyTrends: MonthlyTrend[];
  budgetProgressList: BudgetProgressItem[];
  recentTransactions: Transaction[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const USER_STORAGE_KEY = "finora_user_id";

function categoryWithMetadata(
  category: { id: number; name: string; type: "INCOME" | "EXPENSE" }
): Category {
  const existing = initialCategories.find(
    (item) => item.id === category.id || item.name === category.name
  );

  return {
    id: category.id,
    name: category.name,
    type: category.type,
    color: existing?.color,
    icon: existing?.icon,
  };
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<number | null>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? Number(stored) : null;
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // These remain local until their FA2 backend endpoints are implemented.
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    initialPaymentMethods
  );
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [recurringTransactions, setRecurringTransactions] = useState<
    RecurringTransaction[]
  >(initialRecurringTransactions);

  const [userProfile, setUserProfile] =
    useState<UserProfile>(initialUserProfile);
  const [preferences, setPreferences] =
    useState<UserPreferences>(initialPreferences);

  const [loading, setLoading] = useState(true);

  /*
   * Bootstrap a single FA2 demo user.
   *
   * The backend already supports register/login but the existing FA1 UI
   * does not have a login page. We therefore create/login one technical
   * demo account and persist only its user ID in localStorage.
   */
  useEffect(() => {
    let cancelled = false;

    async function bootstrapUser() {
      try {
        if (userId) {
          return;
        }

        const email = "fa2demo@finora.local";
        const password = "FinoraFA2@2026";

        let auth;

        try {
          auth = await api.login(email, password);
        } catch {
          auth = await api.register("Finora Demo User", email, password);
        }

        if (cancelled) return;

        localStorage.setItem(USER_STORAGE_KEY, String(auth.userId));
        setUserId(auth.userId);
        setUserProfile((prev) => ({
          ...prev,
          name: auth.name,
          email: auth.email,
          avatarText: auth.name.charAt(0).toUpperCase(),
        }));
      } catch (error) {
        console.error("Finora authentication bootstrap failed:", error);
      }
    }

    bootstrapUser();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  /*
   * Load the database-backed FA2 data once a user exists.
   */
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    async function loadData() {
      setLoading(true);

      try {
        if (userId === null) {
          throw new Error("Unable to determine Finora user ID.");
        }
        
        const [
          categoryData,
          accountData,
          transactionData,
          budgetData,
          goalData,
          recurringData,
          paymentMethodData,
        ] = await Promise.all([
          api.categories(),
          api.accounts(userId),
          api.transactions(userId),
          api.budgets(userId).catch(() => []),
          api.goals(userId),
          api.recurringTransactions(userId),
          api.paymentMethods(userId),
        ]);

        if (cancelled) return;

        setCategories(categoryData.map(categoryWithMetadata));

        setAccounts(
          accountData.map((account) => ({
            id: account.id,
            userId: account.userId,
            accountName: account.accountName,
            accountType: account.accountType,
            currentBalance: Number(account.currentBalance),
            currency: account.currency,
          }))
        );

        setTransactions(
          transactionData.map((transaction) => ({
            id: transaction.id,
            userId: transaction.userId,
            accountId: transaction.accountId,
            categoryId: transaction.categoryId,
            paymentMethodId: transaction.paymentMethodId,
            type: transaction.type,
            amount: Number(transaction.amount),
            date: transaction.date,
            description: transaction.description,
            notes: transaction.notes,
          }))
        );

        setBudgets(
          budgetData.map((budget) => ({
            id: budget.id,
            userId: budget.userId,
            categoryId: budget.categoryId,
            limit: Number(budget.amount),
            month: budget.month,
            year: budget.year,
          }))
        );

        setGoals(
          goalData.map((goal) => ({
            id: goal.id,
            userId: goal.userId,
            goalName: goal.goalName,
            targetAmount: Number(goal.targetAmount),
            currentAmount: Number(goal.currentAmount),
            targetDate: goal.targetDate,
            status: goal.status,
            createdAt: goal.createdAt,
            updatedAt: goal.updatedAt,
          }))
        );

        setRecurringTransactions(
          recurringData.map((item) => ({
            id: item.id,
            userId: item.userId,
            accountId: item.accountId,
            categoryId: item.categoryId,
            paymentMethodId: item.paymentMethodId,
            type: item.type,
            amount: Number(item.amount),
            frequency: item.frequency,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
            isActive: item.isActive,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }))
        );

        setPaymentMethods(
          paymentMethodData.map((method) => ({
            id: method.id,
            userId: method.userId,
            methodName: method.methodName,
            details: method.details,
            createdAt: method.createdAt,
          }))
        );

      } catch (error) {
        console.error("Failed to load Finora database data:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Theme
  useEffect(() => {
    const applyTheme = (theme: "light" | "dark" | "system") => {
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else if (theme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        const isSystemDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;

        document.documentElement.setAttribute(
          "data-theme",
          isSystemDark ? "dark" : "light"
        );
      }
    };

    applyTheme(preferences.theme);

    if (preferences.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handler = (event: MediaQueryListEvent) => {
        document.documentElement.setAttribute(
          "data-theme",
          event.matches ? "dark" : "light"
        );
      };

      mediaQuery.addEventListener("change", handler);

      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [preferences.theme]);

  const getAccountById = (id?: number) => {
    if (!id) return undefined;
    return accounts.find((account) => account.id === id);
  };

  const getCategoryById = (id?: number) => {
    if (!id) return undefined;
    return categories.find((category) => category.id === id);
  };

  const getPaymentMethodById = (id?: number) => {
    if (!id) return undefined;
    return paymentMethods.find((method) => method.id === id);
  };

  // -------------------------------------------------------------------------
  // Transactions — DATABASE BACKED
  // -------------------------------------------------------------------------

  const addTransaction = (input: NewTransactionInput): Transaction => {
    const effectiveUserId = userId ?? input.userId;

    const optimistic: Transaction = {
      ...input,
      userId: effectiveUserId,
      id: Date.now(),
    };

    setTransactions((previous) => [optimistic, ...previous]);

    api
      .createTransaction({
        userId: effectiveUserId,
        accountId: input.accountId,
        categoryId: input.categoryId,
        paymentMethodId: input.paymentMethodId,
        type: input.type,
        amount: input.amount,
        transactionDate: input.date,
        description: input.description,
        notes: input.notes,
      })
      .then((saved) => {
        setTransactions((previous) =>
          previous.map((transaction) =>
            transaction.id === optimistic.id
              ? {
                  id: saved.id,
                  userId: saved.userId,
                  accountId: saved.accountId,
                  categoryId: saved.categoryId,
                  paymentMethodId: saved.paymentMethodId,
                  type: saved.type,
                  amount: Number(saved.amount),
                  date: saved.date,
                  description: saved.description,
                  notes: saved.notes,
                }
              : transaction
          )
        );

        return api.accounts(effectiveUserId);
      })
      .then((accountData) => {
        setAccounts(
          accountData.map((account) => ({
            id: account.id,
            userId: account.userId,
            accountName: account.accountName,
            accountType: account.accountType,
            currentBalance: Number(account.currentBalance),
            currency: account.currency,
          }))
        );
      })
      .catch((error) => {
        console.error("Failed to create transaction:", error);

        setTransactions((previous) =>
          previous.filter((transaction) => transaction.id !== optimistic.id)
        );
      });

    return optimistic;
  };

  const updateTransaction = (
    id: number,
    input: Partial<NewTransactionInput>
  ) => {
    const existing = transactions.find((transaction) => transaction.id === id);

    if (!existing || !userId) return;

    const merged = {
      userId,
      accountId: input.accountId ?? existing.accountId,
      categoryId: input.categoryId ?? existing.categoryId,
      paymentMethodId:
        input.paymentMethodId ?? existing.paymentMethodId,
      type: input.type ?? existing.type,
      amount: input.amount ?? existing.amount,
      transactionDate: input.date ?? existing.date,
      description: input.description ?? existing.description,
      notes: input.notes ?? existing.notes,
    };

    api
      .updateTransaction(id, merged)
      .then((saved) => {
        setTransactions((previous) =>
          previous.map((transaction) =>
            transaction.id === id
              ? {
                  ...transaction,
                  id: saved.id,
                  userId: saved.userId,
                  accountId: saved.accountId,
                  categoryId: saved.categoryId,
                  paymentMethodId: saved.paymentMethodId,
                  type: saved.type,
                  amount: Number(saved.amount),
                  date: saved.date,
                  description: saved.description,
                  notes: saved.notes,
                }
              : transaction
          )
        );

        return api.accounts(userId);
      })
      .then((accountData) => {
        setAccounts(
          accountData.map((account) => ({
            id: account.id,
            userId: account.userId,
            accountName: account.accountName,
            accountType: account.accountType,
            currentBalance: Number(account.currentBalance),
            currency: account.currency,
          }))
        );
      })
      .catch((error) => {
        console.error("Failed to update transaction:", error);
      });
  };

  const deleteTransaction = (id: number) => {
    if (!userId) return;

    api
      .deleteTransaction(userId, id)
      .then(() => {
        setTransactions((previous) =>
          previous.filter((transaction) => transaction.id !== id)
        );

        return api.accounts(userId);
      })
      .then((accountData) => {
        setAccounts(
          accountData.map((account) => ({
            id: account.id,
            userId: account.userId,
            accountName: account.accountName,
            accountType: account.accountType,
            currentBalance: Number(account.currentBalance),
            currency: account.currency,
          }))
        );
      })
      .catch((error) => {
        console.error("Failed to delete transaction:", error);
      });
  };

  // -------------------------------------------------------------------------
  // Budgets — DATABASE BACKED
  // -------------------------------------------------------------------------

  const addBudget = (input: NewBudgetInput): Budget => {
    const effectiveUserId = userId ?? input.userId;

    const optimistic: Budget = {
      ...input,
      userId: effectiveUserId,
      id: Date.now(),
    };

    setBudgets((previous) => [...previous, optimistic]);

    api
      .createBudget({
        userId: effectiveUserId,
        categoryId: input.categoryId,
        amount: input.limit,
        month: input.month,
        year: input.year,
      })
      .then((saved) => {
        setBudgets((previous) =>
          previous.map((budget) =>
            budget.id === optimistic.id
              ? {
                  id: saved.id,
                  userId: saved.userId,
                  categoryId: saved.categoryId,
                  limit: Number(saved.amount),
                  month: saved.month,
                  year: saved.year,
                }
              : budget
          )
        );
      })
      .catch((error) => {
        console.error("Failed to create budget:", error);

        setBudgets((previous) =>
          previous.filter((budget) => budget.id !== optimistic.id)
        );
      });

    return optimistic;
  };

  const updateBudget = (
    id: number,
    input: Partial<NewBudgetInput>
  ) => {
    const existing = budgets.find((budget) => budget.id === id);

    if (!existing || !userId) return;

    const merged = {
      userId,
      categoryId: input.categoryId ?? existing.categoryId,
      amount: input.limit ?? existing.limit,
      month: input.month ?? existing.month,
      year: input.year ?? existing.year,
    };

    api
      .updateBudget(id, merged)
      .then((saved) => {
        setBudgets((previous) =>
          previous.map((budget) =>
            budget.id === id
              ? {
                  id: saved.id,
                  userId: saved.userId,
                  categoryId: saved.categoryId,
                  limit: Number(saved.amount),
                  month: saved.month,
                  year: saved.year,
                }
              : budget
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update budget:", error);
      });
  };

  const deleteBudget = (id: number) => {
    if (!userId) return;

    api
      .deleteBudget(userId, id)
      .then(() => {
        setBudgets((previous) =>
          previous.filter((budget) => budget.id !== id)
        );
      })
      .catch((error) => {
        console.error("Failed to delete budget:", error);
      });
  };

  // -------------------------------------------------------------------------
  // Accounts — DATABASE BACKED FOR CREATE/READ
  // -------------------------------------------------------------------------

  const addAccount = (input: NewAccountInput): Account => {
    const effectiveUserId = userId ?? input.userId;

    const optimistic: Account = {
      ...input,
      userId: effectiveUserId,
      id: Date.now(),
    };

    setAccounts((previous) => [...previous, optimistic]);

    api
      .createAccount({
        userId: effectiveUserId,
        accountName: input.accountName,
        accountType: input.accountType,
        currentBalance: input.currentBalance,
        currency: input.currency,
      })
      .then((saved) => {
        setAccounts((previous) =>
          previous.map((account) =>
            account.id === optimistic.id
              ? {
                  id: saved.id,
                  userId: saved.userId,
                  accountName: saved.accountName,
                  accountType: saved.accountType,
                  currentBalance: Number(saved.currentBalance),
                  currency: saved.currency,
                }
              : account
          )
        );
      })
      .catch((error) => {
        console.error("Failed to create account:", error);

        setAccounts((previous) =>
          previous.filter((account) => account.id !== optimistic.id)
        );
      });

    return optimistic;
  };

  const updateAccount = (
    id: number,
    input: Partial<NewAccountInput>
  ) => {
    console.warn(
      "Account update is not persisted yet because the FA2 backend does not expose an account PUT endpoint.",
      id,
      input
    );
  };

  const deleteAccount = (id: number) => {
    console.warn(
      "Account deletion is not persisted yet because the FA2 backend does not expose an account DELETE endpoint.",
      id
    );
  };

  // -------------------------------------------------------------------------
  // Payment methods — intentionally local for current FA2 scope
  // -------------------------------------------------------------------------

  const addPaymentMethod = (input: NewPaymentMethodInput): PaymentMethod => {
    const newMethod: PaymentMethod = {
      ...input,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    setPaymentMethods((previous) => [newMethod, ...previous]);

    return newMethod;
  };

  const updatePaymentMethod = (
    id: number,
    input: Partial<NewPaymentMethodInput>
  ) => {
    setPaymentMethods((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, ...input } : item
      )
    );
  };

  const deletePaymentMethod = (id: number) => {
    setPaymentMethods((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  // -------------------------------------------------------------------------
  // Goals — DATABASE BACKED
  // -------------------------------------------------------------------------

  const addGoal = (input: NewGoalInput): Goal => {
    const effectiveUserId = userId ?? input.userId;

    const optimistic: Goal = {
      ...input,
      userId: effectiveUserId,
      id: Date.now(),
    };

    setGoals((previous) => [optimistic, ...previous]);

    api
      .createGoal({
        userId: effectiveUserId,
        goalName: input.goalName,
        targetAmount: input.targetAmount,
        currentAmount: input.currentAmount,
        targetDate: input.targetDate,
        status: input.status,
      })
      .then((saved) => {
        setGoals((previous) =>
          previous.map((goal) =>
            goal.id === optimistic.id
              ? {
                  id: saved.id,
                  userId: saved.userId,
                  goalName: saved.goalName,
                  targetAmount: Number(saved.targetAmount),
                  currentAmount: Number(saved.currentAmount),
                  targetDate: saved.targetDate,
                  status: saved.status,
                  createdAt: saved.createdAt,
                  updatedAt: saved.updatedAt,
                }
              : goal
          )
        );
      })
      .catch((error) => {
        console.error("Failed to create goal:", error);
        setGoals((previous) =>
          previous.filter((goal) => goal.id !== optimistic.id)
        );
      });

    return optimistic;
  };

  const updateGoal = (
    id: number,
    input: Partial<NewGoalInput>
  ) => {
    const existing = goals.find((goal) => goal.id === id);

    if (!existing || !userId) return;

    const merged = {
      userId,
      goalName: input.goalName ?? existing.goalName,
      targetAmount: input.targetAmount ?? existing.targetAmount,
      currentAmount: input.currentAmount ?? existing.currentAmount,
      targetDate: input.targetDate ?? existing.targetDate,
      status: input.status ?? existing.status,
    };

    api
      .updateGoal(id, merged)
      .then((saved) => {
        setGoals((previous) =>
          previous.map((goal) =>
            goal.id === id
              ? {
                  id: saved.id,
                  userId: saved.userId,
                  goalName: saved.goalName,
                  targetAmount: Number(saved.targetAmount),
                  currentAmount: Number(saved.currentAmount),
                  targetDate: saved.targetDate,
                  status: saved.status,
                  createdAt: saved.createdAt,
                  updatedAt: saved.updatedAt,
                }
              : goal
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update goal:", error);
      });
  };

  const deleteGoal = (id: number) => {
    if (!userId) return;

    api
      .deleteGoal(userId, id)
      .then(() => {
        setGoals((previous) =>
          previous.filter((goal) => goal.id !== id)
        );
      })
      .catch((error) => {
        console.error("Failed to delete goal:", error);
      });
  };

  // -------------------------------------------------------------------------
  // Recurring transactions — DATABASE BACKED
  // -------------------------------------------------------------------------

  const addRecurringTransaction = (
    input: NewRecurringTransactionInput
  ): RecurringTransaction => {
    const effectiveUserId = userId ?? input.userId;

    const optimistic: RecurringTransaction = {
      ...input,
      userId: effectiveUserId,
      id: Date.now(),
    };

    setRecurringTransactions((previous) => [
      optimistic,
      ...previous,
    ]);

    api
      .createRecurringTransaction({
        userId: effectiveUserId,
        accountId: input.accountId,
        categoryId: input.categoryId,
        paymentMethodId: input.paymentMethodId,
        type: input.type,
        amount: input.amount,
        frequency: input.frequency,
        startDate: input.startDate,
        endDate: input.endDate,
        description: input.description,
        isActive: input.isActive,
      })
      .then((saved) => {
        setRecurringTransactions((previous) =>
          previous.map((item) =>
            item.id === optimistic.id
              ? {
                  id: saved.id,
                  userId: saved.userId,
                  accountId: saved.accountId,
                  categoryId: saved.categoryId,
                  paymentMethodId: saved.paymentMethodId,
                  type: saved.type,
                  amount: Number(saved.amount),
                  frequency: saved.frequency,
                  startDate: saved.startDate,
                  endDate: saved.endDate,
                  description: saved.description,
                  isActive: saved.isActive,
                  createdAt: saved.createdAt,
                  updatedAt: saved.updatedAt,
                }
              : item
          )
        );
      })
      .catch((error) => {
        console.error("Failed to create recurring transaction:", error);
        setRecurringTransactions((previous) =>
          previous.filter((item) => item.id !== optimistic.id)
        );
      });

    return optimistic;
  };

  const updateRecurringTransaction = (
    id: number,
    input: Partial<NewRecurringTransactionInput>
  ) => {
    const existing = recurringTransactions.find((item) => item.id === id);

    if (!existing || !userId) return;

    const merged = {
      userId,
      accountId: input.accountId ?? existing.accountId,
      categoryId: input.categoryId ?? existing.categoryId,
      paymentMethodId:
        input.paymentMethodId ?? existing.paymentMethodId,
      type: input.type ?? existing.type,
      amount: input.amount ?? existing.amount,
      frequency: input.frequency ?? existing.frequency,
      startDate: input.startDate ?? existing.startDate,
      endDate: input.endDate ?? existing.endDate,
      description: input.description ?? existing.description,
      isActive: input.isActive ?? existing.isActive,
    };

    api
      .updateRecurringTransaction(id, merged)
      .then((saved) => {
        setRecurringTransactions((previous) =>
          previous.map((item) =>
            item.id === id
              ? {
                  id: saved.id,
                  userId: saved.userId,
                  accountId: saved.accountId,
                  categoryId: saved.categoryId,
                  paymentMethodId: saved.paymentMethodId,
                  type: saved.type,
                  amount: Number(saved.amount),
                  frequency: saved.frequency,
                  startDate: saved.startDate,
                  endDate: saved.endDate,
                  description: saved.description,
                  isActive: saved.isActive,
                  createdAt: saved.createdAt,
                  updatedAt: saved.updatedAt,
                }
              : item
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update recurring transaction:", error);
      });
  };

  const deleteRecurringTransaction = (id: number) => {
    if (!userId) return;

    api
      .deleteRecurringTransaction(userId, id)
      .then(() => {
        setRecurringTransactions((previous) =>
          previous.filter((item) => item.id !== id)
        );
      })
      .catch((error) => {
        console.error("Failed to delete recurring transaction:", error);
      });
  };

  const toggleRecurringTransaction = (id: number) => {
    const existing = recurringTransactions.find((item) => item.id === id);

    if (!existing || !userId) return;

    updateRecurringTransaction(id, {
      isActive: !existing.isActive,
    });
  };

  // -------------------------------------------------------------------------
  // Profile & Preferences
  // -------------------------------------------------------------------------

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((previous) => ({
      ...previous,
      ...profile,
      avatarText:
        profile.name !== undefined
          ? profile.name.charAt(0).toUpperCase()
          : previous.avatarText,
    }));
  };

  const updatePreferences = (
    prefs: Partial<UserPreferences>
  ) => {
    setPreferences((previous) => {
      const updated = { ...previous, ...prefs };

      if (prefs.currency) {
        if (prefs.currency === "INR") updated.currencySymbol = "₹";
        else if (prefs.currency === "USD") updated.currencySymbol = "$";
        else if (prefs.currency === "EUR") updated.currencySymbol = "€";
        else if (prefs.currency === "GBP") updated.currencySymbol = "£";
      }

      return updated;
    });
  };

  const resetDataToDefault = () => {
    setPaymentMethods(initialPaymentMethods);
    setGoals(initialGoals);
    setRecurringTransactions(initialRecurringTransactions);
    setUserProfile(initialUserProfile);
    setPreferences(initialPreferences);

    // Reload database-backed state rather than restoring mock financial data.
    if (userId) {
      Promise.all([
        api.accounts(userId),
        api.transactions(userId),
        api.budgets(userId),
        api.categories(),
        api.goals(userId),
        api.recurringTransactions(userId),
        api.paymentMethods(userId),
      ])
        .then(
          ([
            accountData,
            transactionData,
            budgetData,
            categoryData,
            goalData,
            recurringData,
            paymentMethodData,
          ]) => {
          setAccounts(
            accountData.map((account) => ({
              id: account.id,
              userId: account.userId,
              accountName: account.accountName,
              accountType: account.accountType,
              currentBalance: Number(account.currentBalance),
              currency: account.currency,
            }))
          );

          setTransactions(
            transactionData.map((transaction) => ({
              id: transaction.id,
              userId: transaction.userId,
              accountId: transaction.accountId,
              categoryId: transaction.categoryId,
              type: transaction.type,
              amount: Number(transaction.amount),
              date: transaction.date,
              description: transaction.description,
              notes: transaction.notes,
            }))
          );

          setBudgets(
            budgetData.map((budget) => ({
              id: budget.id,
              userId: budget.userId,
              categoryId: budget.categoryId,
              limit: Number(budget.amount),
              month: budget.month,
              year: budget.year,
            }))
          );

          setCategories(categoryData.map(categoryWithMetadata));

          setGoals(
            goalData.map((goal) => ({
              id: goal.id,
              userId: goal.userId,
              goalName: goal.goalName,
              targetAmount: Number(goal.targetAmount),
              currentAmount: Number(goal.currentAmount),
              targetDate: goal.targetDate,
              status: goal.status,
              createdAt: goal.createdAt,
              updatedAt: goal.updatedAt,
            }))
          );

          setRecurringTransactions(
            recurringData.map((item) => ({
              id: item.id,
              userId: item.userId,
              accountId: item.accountId,
              categoryId: item.categoryId,
              paymentMethodId: item.paymentMethodId,
              type: item.type,
              amount: Number(item.amount),
              frequency: item.frequency,
              startDate: item.startDate,
              endDate: item.endDate,
              description: item.description,
              isActive: item.isActive,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            }))
          );

          setPaymentMethods(
            paymentMethodData.map((method) => ({
              id: method.id,
              userId: method.userId,
              methodName: method.methodName,
              details: method.details,
              createdAt: method.createdAt,
            }))
          );
        })
        .catch((error) => {
          console.error("Failed to reload database data:", error);
        });
    }
  };

  // -------------------------------------------------------------------------
  // Computed metrics
  // -------------------------------------------------------------------------

  const {
    totalIncome,
    totalExpenses,
    totalBalance,
    totalSavings,
    savingsRate,
  } = useMemo(() => {
    let income = 0;
    let expenses = 0;

    for (const transaction of transactions) {
      if (transaction.type === "INCOME") {
        income += transaction.amount;
      } else {
        expenses += transaction.amount;
      }
    }

    const balance = income - expenses;
    const savings = Math.max(0, balance);
    const rate =
      income > 0 ? Math.round((savings / income) * 100) : 0;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: balance,
      totalSavings: savings,
      savingsRate: rate,
    };
  }, [transactions]);

  const categoryExpenses = useMemo(() => {
    const expenseTotals: Record<number, number> = {};
    let totalExpense = 0;

    for (const transaction of transactions) {
      if (transaction.type !== "EXPENSE") continue;

      expenseTotals[transaction.categoryId] =
        (expenseTotals[transaction.categoryId] || 0) +
        transaction.amount;

      totalExpense += transaction.amount;
    }

    return Object.entries(expenseTotals)
      .map(([categoryIdString, value]) => {
        const categoryId = Number(categoryIdString);
        const category = categories.find(
          (item) => item.id === categoryId
        );

        return {
          categoryId,
          name: category?.name || `Category ${categoryId}`,
          value,
          percentage:
            totalExpense > 0
              ? Math.round((value / totalExpense) * 100)
              : 0,
          color: category?.color || "#94a3b8",
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const monthlyTrends = useMemo(() => {
    const now = new Date();
    const months: MonthlyTrend[] = [];

    for (let offset = 5; offset >= 0; offset--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - offset,
        1
      );

      const year = date.getFullYear();
      const monthNumber = date.getMonth() + 1;

      let income = 0;
      let expenses = 0;

      for (const transaction of transactions) {
        const transactionDate = new Date(
          `${transaction.date}T00:00:00`
        );

        if (
          transactionDate.getFullYear() === year &&
          transactionDate.getMonth() + 1 === monthNumber
        ) {
          if (transaction.type === "INCOME") {
            income += transaction.amount;
          } else {
            expenses += transaction.amount;
          }
        }
      }

      months.push({
        month: date.toLocaleString("en-US", {
          month: "short",
        }),
        monthNumber,
        income,
        expenses,
        savings: Math.max(0, income - expenses),
      });
    }

    return months;
  }, [transactions]);

  const budgetProgressList = useMemo(() => {
    return budgets.map((budget) => {
      const category = categories.find(
        (item) => item.id === budget.categoryId
      );

      const spent = transactions
        .filter((transaction) => {
          if (transaction.type !== "EXPENSE") return false;
          if (transaction.categoryId !== budget.categoryId) return false;

          const date = new Date(
            `${transaction.date}T00:00:00`
          );

          return (
            date.getFullYear() === budget.year &&
            date.getMonth() + 1 === budget.month
          );
        })
        .reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );

      const remaining = Math.max(
        0,
        budget.limit - spent
      );

      const percentage =
        budget.limit > 0
          ? Math.round((spent / budget.limit) * 100)
          : 0;

      return {
        id: budget.id,
        categoryId: budget.categoryId,
        category:
          category?.name || `Category ${budget.categoryId}`,
        color: category?.color || "#38bdf8",
        spent,
        limit: budget.limit,
        remaining,
        percentage,
        month: budget.month,
        year: budget.year,
      };
    });
  }, [budgets, transactions, categories]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort(
        (a, b) =>
          new Date(`${b.date}T00:00:00`).getTime() -
          new Date(`${a.date}T00:00:00`).getTime()
      )
      .slice(0, 5);
  }, [transactions]);

  const value: FinanceContextType = {
    transactions,
    budgets,
    categories,
    accounts,
    paymentMethods,
    goals,
    recurringTransactions,
    userProfile,
    preferences,

    addTransaction,
    updateTransaction,
    deleteTransaction,

    addBudget,
    updateBudget,
    deleteBudget,

    addAccount,
    updateAccount,
    deleteAccount,

    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,

    addGoal,
    updateGoal,
    deleteGoal,

    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    toggleRecurringTransaction,

    updateUserProfile,
    updatePreferences,
    resetDataToDefault,

    getAccountById,
    getCategoryById,
    getPaymentMethodById,

    totalIncome,
    totalExpenses,
    totalBalance,
    totalSavings,
    savingsRate,
    categoryExpenses,
    monthlyTrends,
    budgetProgressList,
    recentTransactions,
  };

  // Keep loading state internal for now; the existing FA1 UI has no loading
  // shell. Returning the provider immediately preserves the existing layout.
  void loading;

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance(): FinanceContextType {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error(
      "useFinance must be used within a FinanceProvider"
    );
  }

  return context;
}
