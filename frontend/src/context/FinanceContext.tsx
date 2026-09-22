import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import type { Transaction, NewTransactionInput } from "../types/transaction";
import type { Budget, NewBudgetInput } from "../types/budget";
import type { Category } from "../types/category";
import type { UserProfile, UserPreferences } from "../types/settings";
import {
  initialCategories,
  initialTransactions,
  initialBudgets,
  initialUserProfile,
  initialPreferences,
} from "../data/mockData";

interface CategoryExpense {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface MonthlyTrend {
  month: string;
  monthNumber: number;
  income: number;
  expenses: number;
  savings: number;
}

interface BudgetProgressItem {
  id: number;
  category: string;
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
  userProfile: UserProfile;
  preferences: UserPreferences;
  addTransaction: (input: NewTransactionInput) => Transaction;
  updateTransaction: (id: number, input: Partial<NewTransactionInput>) => void;
  deleteTransaction: (id: number) => void;
  addBudget: (input: NewBudgetInput) => Budget;
  updateBudget: (id: number, input: Partial<NewBudgetInput>) => void;
  deleteBudget: (id: number) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  resetDataToDefault: () => void;
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

// Vibrant, theme-harmonious colors that look stunning on both Light and Dark modes
const CATEGORY_COLORS: Record<string, string> = {
  Food: "#38bdf8",          // Sky Blue
  Transport: "#818cf8",     // Indigo
  Shopping: "#f472b6",      // Rose / Pink
  Bills: "#fb923c",         // Amber / Orange
  Entertainment: "#a78bfa", // Violet / Purple
  Healthcare: "#34d399",    // Emerald Green
  Education: "#fb7185",     // Coral Red
  Salary: "#10b981",        // Mint Green
  Freelance: "#06b6d4",     // Cyan
  Allowance: "#2dd4bf",     // Teal
  Other: "#94a3b8",         // Slate
};

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [categories] = useState<Category[]>(initialCategories);
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
        const isSystemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
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

  const addTransaction = (input: NewTransactionInput): Transaction => {
    const newTransaction: Transaction = {
      ...input,
      id: Date.now() + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateTransaction = (id: number, input: Partial<NewTransactionInput>) => {
    setTransactions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...input } : item))
    );
  };

  const deleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  const addBudget = (input: NewBudgetInput): Budget => {
    const newBudget: Budget = {
      ...input,
      id: Date.now() + Math.floor(Math.random() * 1000),
    };
    setBudgets((prev) => [...prev, newBudget]);
    return newBudget;
  };

  const updateBudget = (id: number, input: Partial<NewBudgetInput>) => {
    setBudgets((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...input } : item))
    );
  };

  const deleteBudget = (id: number) => {
    setBudgets((prev) => prev.filter((item) => item.id !== id));
  };

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
    setTransactions(initialTransactions);
    setBudgets(initialBudgets);
    setUserProfile(initialUserProfile);
    setPreferences(initialPreferences);
  };

  // Calculations
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

    const balance = inc - exp;
    const savings = Math.max(0, balance);
    const rate = inc > 0 ? Math.round((savings / inc) * 100) : 0;

    return {
      totalIncome: inc,
      totalExpenses: exp,
      totalBalance: balance,
      totalSavings: savings,
      savingsRate: rate,
    };
  }, [transactions]);

  // Category breakdown for expenses
  const categoryExpenses = useMemo(() => {
    const expenseTotals: Record<string, number> = {};
    let totalExp = 0;

    transactions.forEach((tx) => {
      if (tx.type === "EXPENSE") {
        expenseTotals[tx.category] = (expenseTotals[tx.category] || 0) + tx.amount;
        totalExp += tx.amount;
      }
    });

    const items: CategoryExpense[] = Object.entries(expenseTotals).map(([name, value]) => ({
      name,
      value,
      percentage: totalExp > 0 ? Math.round((value / totalExp) * 100) : 0,
      color: CATEGORY_COLORS[name] || "#94a3b8",
    }));

    items.sort((a, b) => b.value - a.value);
    return items;
  }, [transactions]);

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
    const spentByCategory: Record<string, number> = {};
    transactions.forEach((tx) => {
      if (tx.type === "EXPENSE" && tx.date.startsWith("2026-09")) {
        spentByCategory[tx.category] = (spentByCategory[tx.category] || 0) + tx.amount;
      }
    });

    return budgets.map((b) => {
      const spent = spentByCategory[b.category] !== undefined
        ? spentByCategory[b.category]
        : Math.round(b.limit * 0.45);

      const remaining = Math.max(0, b.limit - spent);
      const percentage = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;

      return {
        id: b.id,
        category: b.category,
        spent,
        limit: b.limit,
        remaining,
        percentage,
        month: b.month,
        year: b.year,
      };
    });
  }, [budgets, transactions]);

  // Recent transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  const value = {
    transactions,
    budgets,
    categories,
    userProfile,
    preferences,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    updateUserProfile,
    updatePreferences,
    resetDataToDefault,
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
