import React, { useState, useMemo } from "react";
import BudgetCard from "../components/budgets/BudgetCard";
import BudgetForm from "../components/budgets/BudgetForm";
import SelectField from "../components/ui/SelectField";
import Icon from "../components/ui/Icon";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency } from "../utils/formatters";
import type { Budget } from "../types/budget";

const MONTH_FILTER_OPTIONS = [
  { value: "9", label: "September 2026" },
  { value: "8", label: "August 2026" },
  { value: "7", label: "July 2026" },
  { value: "6", label: "June 2026" },
];

export default function Budgets() {
  const { budgetProgressList, deleteBudget, preferences } = useFinance();

  const [selectedMonth, setSelectedMonth] = useState("9");
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>(undefined);

  const filteredBudgets = useMemo(() => {
    const m = parseInt(selectedMonth, 10);
    return budgetProgressList.filter((b) => b.month === m);
  }, [budgetProgressList, selectedMonth]);

  // Overall totals
  const { totalBudget, totalSpent, remainingBudget, overallPercentage } = useMemo(() => {
    let bSum = 0;
    let sSum = 0;

    filteredBudgets.forEach((b) => {
      bSum += b.limit;
      sSum += b.spent;
    });

    const rem = Math.max(0, bSum - sSum);
    const pct = bSum > 0 ? Math.round((sSum / bSum) * 100) : 0;

    return {
      totalBudget: bSum,
      totalSpent: sSum,
      remainingBudget: rem,
      overallPercentage: pct,
    };
  }, [filteredBudgets]);

  const sym = preferences.currencySymbol;

  const handleOpenCreate = () => {
    setEditingBudget(undefined);
    setShowModal(true);
  };

  const handleOpenEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBudget(undefined);
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="page-kicker">SPENDING LIMITS</p>
          <h2>Budgets</h2>
          <p>Set, monitor, and manage monthly category spending targets.</p>
        </div>

        <div className="page-heading-actions">
          <SelectField
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={MONTH_FILTER_OPTIONS}
            className="month-filter-select"
          />

          <button
            className="primary-button add-btn"
            type="button"
            onClick={handleOpenCreate}
          >
            <Icon name="plus" size={16} strokeWidth={2.4} />
            <span>Create Budget</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-card-top">
            <span>Total Budget</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="budget" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{formatCurrency(totalBudget, sym)}</strong>
          <p className="stat-change positive">Allocated this month</p>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span>Total Spent</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="expense" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{formatCurrency(totalSpent, sym)}</strong>
          <p className={overallPercentage > 100 ? "stat-change negative" : "stat-change positive"}>
            {overallPercentage}% of total limit
          </p>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span>Remaining Budget</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="wallet" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{formatCurrency(remainingBudget, sym)}</strong>
          <p className="stat-change positive">Available to spend</p>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span>Overall Status</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="shield" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{overallPercentage <= 100 ? "On Track" : "Exceeded"}</strong>
          <p className={overallPercentage > 85 ? "stat-change negative" : "stat-change positive"}>
            {overallPercentage <= 85 ? "Healthy financial pacing" : "Attention recommended"}
          </p>
        </article>
      </div>

      {/* Category Budgets Grid */}
      <div className="budgets-section">
        <div className="section-subheading">
          <h3>Category Spending Limits</h3>
          <span className="section-badge">{filteredBudgets.length} Active Budgets</span>
        </div>

        {filteredBudgets.length === 0 ? (
          <div className="empty-dashboard">
            <div className="empty-icon-circle">
              <Icon name="budget" size={26} />
            </div>
            <h3>No budgets set for this month</h3>
            <p>Create a category budget to start monitoring your spending limits.</p>
            <button
              className="primary-button add-btn"
              type="button"
              onClick={handleOpenCreate}
              style={{ marginTop: "16px" }}
            >
              <Icon name="plus" size={16} strokeWidth={2.4} />
              <span>Create First Budget</span>
            </button>
          </div>
        ) : (
          <div className="budget-cards-grid">
            {filteredBudgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                currencySymbol={sym}
                onEdit={handleOpenEdit}
                onDelete={deleteBudget}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <BudgetForm
          onClose={handleCloseModal}
          existingBudget={editingBudget}
        />
      )}
    </section>
  );
}
