import React, { useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import OverviewChart from "../components/dashboard/OverviewChart";
import ExpenseBreakdown from "../components/dashboard/ExpenseBreakdown";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import TransactionForm from "../components/transactions/TransactionForm";
import Icon from "../components/ui/Icon";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency } from "../utils/formatters";

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const {
    totalBalance,
    totalIncome,
    totalExpenses,
    totalSavings,
    savingsRate,
    preferences,
  } = useFinance();

  const sym = preferences.currencySymbol;

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="page-kicker">OVERVIEW</p>
          <h2>Dashboard</h2>
          <p>Track your income, expenses and overall financial health.</p>
        </div>

        <button
          className="primary-button add-btn"
          type="button"
          onClick={() => setShowForm(true)}
        >
          <Icon name="plus" size={16} strokeWidth={2.4} />
          <span>Add Transaction</span>
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total Balance"
          value={formatCurrency(totalBalance, sym)}
          change="+12.4% from last month"
          icon="wallet"
          positive={totalBalance >= 0}
        />

        <StatCard
          label="Total Income"
          value={formatCurrency(totalIncome, sym)}
          change="+8.7% from last month"
          icon="income"
          positive
        />

        <StatCard
          label="Total Expenses"
          value={formatCurrency(totalExpenses, sym)}
          change="-4.2% from last month"
          icon="expense"
          positive={false}
        />

        <StatCard
          label="Net Savings"
          value={formatCurrency(totalSavings, sym)}
          change={`${savingsRate}% savings rate`}
          icon="savings"
          positive
        />
      </div>

      <div className="dashboard-grid dashboard-grid-top">
        <OverviewChart />
        <ExpenseBreakdown />
      </div>

      <div className="dashboard-grid dashboard-grid-bottom">
        <RecentTransactions />
        <BudgetProgress />
      </div>

      {showForm && (
        <TransactionForm onClose={() => setShowForm(false)} />
      )}
    </section>
  );
}
