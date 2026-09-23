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
  initialAccounts,
  initialPaymentMethods,
  initialGoals,
  initialRecurringTransactions,
  initialTransactions,
  initialBudgets,
  initialUserProfile,
  initialPreferences,
} from "../data/mockData";

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

  // Transaction CRUD
  addTransaction: (input: NewTransactionInput) => Transaction;
  updateTransaction: (id: number, input: Partial<NewTransactionInput>) => void;
  deleteTransaction: (id: number) => void;

  // Budget CRUD
  addBudget: (input: NewBudgetInput) => Budget;
  updateBudget: (id: number, input: Partial<NewBudgetInput>) => void;
  deleteBudget: (id: number) => void;

  // Account CRUD
  addAccount: (input: NewAccountInput) => Account;
  updateAccount: (id: number, input: Partial<NewAccountInput>) => void;
  deleteAccount: (id: number) => void;

  // Payment Method CRUD
  addPaymentMethod: (input: NewPaymentMethodInput) => PaymentMethod;
  updatePaymentMethod: (id: number, input: Partial<NewPaymentMethodInput>) => void;
  deletePaymentMethod: (id: number) => void;

  // Goal CRUD
  addGoal: (input: NewGoalInput) => Goal;
  updateGoal: (id: number, input: Partial<NewGoalInput>) => void;
  deleteGoal: (id: number) => void;

  // Recurring Transaction CRUD
  addRecurringTransaction: (input: NewRecurringTransactionInput) => RecurringTransaction;
  updateRecurringTransaction: (id: number, input: Partial<NewRecurringTransactionInput>) => void;
  deleteRecurringTransaction: (id: number) => void;
  toggleRecurringTransaction: (id: number) => void;

  // Profile & Settings
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  resetDataToDefault: () => void;

  // Entity Resolvers
  getAccountById: (id?: number) => Account | undefined;
  getCategoryById: (id?: number) => Category | undefined;
  getPaymentMethodById: (id?: number) => PaymentMethod | undefined;

  // Computed metrics
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

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [categories] = useState<Category[]>(initialCategories);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(
    initialRecurringTransactions
  );
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);

  // Apply theme to document element
  useEffect(() => {
    const applyTheme = (theme: "light" | "dark" | "system") => {
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else if (theme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        const isSystemDark =
          window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.setAttribute("data-theme", isSystemDark ? "dark" : "light");
      }
    };

    applyTheme(preferences.theme);

    if (preferences.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [preferences.theme]);

  // Entity Resolvers
  const getAccountById = (id?: number): Account | undefined => {
    if (!id) return undefined;
    return accounts.find((a) => a.id === id);
  };

  const getCategoryById = (id?: number): Category | undefined => {
    if (!id) return undefined;
    return categories.find((c) => c.id === id);
  };

  const getPaymentMethodById = (id?: number): PaymentMethod | undefined => {
    if (!id) return undefined;
    return paymentMethods.find((p) => p.id === id);
  };

  // Transaction CRUD
  const addTransaction = (input: NewTransactionInput): Transaction => {
    const newTransaction: Transaction = {
      ...input,
      id: Date.now() + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);

    // Update account balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === input.accountId) {
          const delta = input.type === "INCOME" ? input.amount : -input.amount;
          return { ...acc, currentBalance: acc.currentBalance + delta };
        }
        return acc;
      })
    );

    return newTransaction;
  };

  const updateTransaction = (id: number, input: Partial<NewTransactionInput>) => {
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...input, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteTransaction = (id: number) => {
    const target = transactions.find((t) => t.id === id);
    if (target) {
      // Revert balance on account
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === target.accountId) {
            const revertDelta = target.type === "INCOME" ? -target.amount : target.amount;
            return { ...acc, currentBalance: acc.currentBalance + revertDelta };
          }
          return acc;
        })
      );
    }
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  // Budget CRUD
  const addBudget = (input: NewBudgetInput): Budget => {
    const newBudget: Budget = {
      ...input,
      id: Date.now() + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBudgets((prev) => [...prev, newBudget]);
    return newBudget;
  };

  const updateBudget = (id: number, input: Partial<NewBudgetInput>) => {
    setBudgets((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...input, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteBudget = (id: number) => {
    setBudgets((prev) => prev.filter((item) => item.id !== id));
  };

  // Account CRUD
  const addAccount = (input: NewAccountInput): Account => {
    const newAccount: Account = {
      ...input,
      id: Date.now() + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAccounts((prev) => [...prev, newAccount]);
    return newAccount;
  };

  const updateAccount = (id: number, input: Partial<NewAccountInput>) => {
    setAccounts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...input, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteAccount = (id: number) => {
    setAccounts((prev) => prev.filter((item) => item.id !== id));
  };

  // Payment Method CRUD
  const addPaymentMethod = (input: NewPaymentMethodInput): PaymentMethod => {
    const newMethod: PaymentMethod = {
      ...input,
      id: Date.now() + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
    };
    setPaymentMethods((prev) => [...prev, newMethod]);
    return newMethod;
  };

  const updatePaymentMethod = (id: number, input: Partial<NewPaymentMethodInput>) => {
    setPaymentMethods((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...input } : item))
    );
  };

  const deletePaymentMethod = (id: number) => {
    setPaymentMethods((prev) => prev.filter((item) => item.id !== id));
  };

  // Goal CRUD
  const addGoal = (input: NewGoalInput): Goal => {
    const newGoal: Goal = {
      ...input,
      id: Date.now() + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = (id: number, input: Partial<NewGoalInput>) => {
    setGoals((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...input, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteGoal = (id: number) => {
    setGoals((prev) => prev.filter((item) => item.id !== id));
  };

  // Recurring Transaction CRUD
  const addRecurringTransaction = (
    input: NewRecurringTransactionInput
  ): RecurringTransaction => {
    const newRecurring: RecurringTransaction = {
      ...input,
      id: Date.now() + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecurringTransactions((prev) => [...prev, newRecurring]);
    return newRecurring;
  };

  const updateRecurringTransaction = (
    id: number,
    input: Partial<NewRecurringTransactionInput>
  ) => {
    setRecurringTransactions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...input, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteRecurringTransaction = (id: number) => {
    setRecurringTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleRecurringTransaction = (id: number) => {
    setRecurringTransactions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  // Profile & Preferences
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...prefs };
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
    setAccounts(initialAccounts);
    setPaymentMethods(initialPaymentMethods);
    setGoals(initialGoals);
    setRecurringTransactions(initialRecurringTransactions);
    setTransactions(initialTransactions);
    setBudgets(initialBudgets);
    setUserProfile(initialUserProfile);
    setPreferences(initialPreferences);
  };

  // Computations
  const { totalIncome, totalExpenses, totalBalance, totalSavings, savingsRate } = useMemo(() => {
    let inc = 0;
    let exp = 0;

    transactions.forEach((tx) => {
      if (tx.type === "INCOME") {
        inc += tx.amount;
      } else {
        exp += tx.amount;
      }
    });

    const calculatedBalance = inc - exp;
    const savings = Math.max(0, calculatedBalance);
    const rate = inc > 0 ? Math.round((savings / inc) * 100) : 0;

    return {
      totalIncome: inc,
      totalExpenses: exp,
      totalBalance: calculatedBalance,
      totalSavings: savings,
      savingsRate: rate,
    };
  }, [transactions]);

  // Category breakdown for expenses
  const categoryExpenses = useMemo(() => {
    const expenseTotals: Record<number, number> = {};
    let totalExp = 0;

    transactions.forEach((tx) => {
      if (tx.type === "EXPENSE") {
        expenseTotals[tx.categoryId] = (expenseTotals[tx.categoryId] || 0) + tx.amount;
        totalExp += tx.amount;
      }
    });

    const items: CategoryExpense[] = Object.entries(expenseTotals).map(([catIdStr, value]) => {
      const catId = Number(catIdStr);
      const cat = categories.find((c) => c.id === catId);
      return {
        categoryId: catId,
        name: cat ? cat.name : `Category ${catId}`,
        value,
        percentage: totalExp > 0 ? Math.round((value / totalExp) * 100) : 0,
        color: cat?.color || "#94a3b8",
      };
    });

    items.sort((a, b) => b.value - a.value);
    return items;
  }, [transactions, categories]);

  // Monthly trends (Last 6 months)
  const monthlyTrends = useMemo(() => {
    const baseMonths = [
      { month: "Apr", monthNumber: 4, income: 42000, expenses: 18500 },
      { month: "May", monthNumber: 5, income: 48000, expenses: 22100 },
      { month: "Jun", monthNumber: 6, income: 45500, expenses: 19800 },
      { month: "Jul", monthNumber: 7, income: 52000, expenses: 24600 },
      { month: "Aug", monthNumber: 8, income: 57000, expenses: 27400 },
      { month: "Sep", monthNumber: 9, income: 0, expenses: 0 },
    ];

    let sepInc = 0;
    let sepExp = 0;

    transactions.forEach((tx) => {
      if (tx.date.startsWith("2026-09")) {
        if (tx.type === "INCOME") sepInc += tx.amount;
        else sepExp += tx.amount;
      }
    });

    baseMonths[5].income = sepInc || 65000;
    baseMonths[5].expenses = sepExp || 22420;

    return baseMonths.map((m) => ({
      ...m,
      savings: Math.max(0, m.income - m.expenses),
    }));
  }, [transactions]);

  // Budget progress items
  const budgetProgressList = useMemo(() => {
    const spentByCategory: Record<number, number> = {};
    transactions.forEach((tx) => {
      if (tx.type === "EXPENSE" && tx.date.startsWith("2026-09")) {
        spentByCategory[tx.categoryId] =
          (spentByCategory[tx.categoryId] || 0) + tx.amount;
      }
    });

    return budgets.map((b) => {
      const cat = categories.find((c) => c.id === b.categoryId);
      const categoryName = cat ? cat.name : `Category ${b.categoryId}`;
      const color = cat?.color || "#38bdf8";

      const spent =
        spentByCategory[b.categoryId] !== undefined
          ? spentByCategory[b.categoryId]
          : Math.round(b.limit * 0.45);

      const remaining = Math.max(0, b.limit - spent);
      const percentage = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;

      return {
        id: b.id,
        categoryId: b.categoryId,
        category: categoryName,
        color,
        spent,
        limit: b.limit,
        remaining,
        percentage,
        month: b.month,
        year: b.year,
      };
    });
  }, [budgets, transactions, categories]);

  // Recent transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance(): FinanceContextType {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
