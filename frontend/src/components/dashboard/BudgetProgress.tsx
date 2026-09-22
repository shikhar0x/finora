import React from "react";
import { Link } from "react-router-dom";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency } from "../../utils/formatters";

export default function BudgetProgress() {
  const { budgetProgressList, preferences } = useFinance();

  const topBudgets = budgetProgressList.slice(0, 4);

  return (
    <section className="dashboard-card budget-card">
      <div className="card-heading">
        <div>
          <p className="card-kicker">LIMITS</p>
          <h3>Budget Progress</h3>
        </div>

        <Link to="/budgets" className="text-button-link">
          Manage
        </Link>
      </div>

      {topBudgets.length === 0 ? (
        <div className="empty-section-state">
          <p>No active budgets set for this month.</p>
        </div>
      ) : (
        <div className="budget-list">
          {topBudgets.map((budget) => {
            const isOver = budget.percentage > 100;
            const isWarning = budget.percentage >= 80 && budget.percentage <= 100;

            const spentFormatted = formatCurrency(
              budget.spent,
              preferences.currencySymbol
            );
            const limitFormatted = formatCurrency(
              budget.limit,
              preferences.currencySymbol
            );

            return (
              <div className="budget-row" key={budget.category}>
                <div className="budget-label">
                  <span className="budget-category-title">{budget.category}</span>
                  <span className="budget-amount-ratio">
                    {spentFormatted} / {limitFormatted}
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className={`progress-fill ${
                      isOver ? "progress-alert" : isWarning ? "progress-warning" : ""
                    }`}
                    style={{ width: `${Math.min(100, budget.percentage)}%` }}
                  />
                </div>

                <div className="budget-footer-row">
                  <span className="budget-remaining-text">
                    {isOver
                      ? `Exceeded by ${formatCurrency(budget.spent - budget.limit, preferences.currencySymbol)}`
                      : `${formatCurrency(budget.remaining, preferences.currencySymbol)} left`}
                  </span>
                  <span
                    className={`budget-percentage ${
                      isOver ? "percentage-alert" : isWarning ? "percentage-warning" : ""
                    }`}
                  >
                    {budget.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
