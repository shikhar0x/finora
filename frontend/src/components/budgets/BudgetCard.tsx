import React, { useState } from "react";
import Icon from "../ui/Icon";
import { formatCurrency } from "../../utils/formatters";
import type { Budget } from "../../types/budget";

interface BudgetCardProps {
  budget: {
    id: number;
    category: string;
    spent: number;
    limit: number;
    remaining: number;
    percentage: number;
    month: number;
    year: number;
  };
  currencySymbol: string;
  onEdit: (budget: Budget) => void;
  onDelete: (id: number) => void;
}

export default function BudgetCard({
  budget,
  currencySymbol,
  onEdit,
  onDelete,
}: BudgetCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isOver = budget.percentage > 100;
  const isWarning = budget.percentage >= 80 && budget.percentage <= 100;

  const spentFormatted = formatCurrency(budget.spent, currencySymbol);
  const limitFormatted = formatCurrency(budget.limit, currencySymbol);
  const remainingFormatted = formatCurrency(budget.remaining, currencySymbol);

  return (
    <article className="budget-card-item">
      <div className="budget-card-header">
        <div className="budget-card-title-group">
          <div className="budget-card-icon">
            <Icon name="tag" size={16} strokeWidth={2} />
          </div>
          <div>
            <h4>{budget.category}</h4>
            <span className="budget-month-label">
              Monthly Limit
            </span>
          </div>
        </div>

        <div className="budget-card-actions">
          {confirmDelete ? (
            <div className="budget-delete-confirm">
              <button
                type="button"
                className="confirm-delete-btn"
                onClick={() => onDelete(budget.id)}
                title="Confirm delete"
              >
                <Icon name="check" size={13} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                className="cancel-delete-btn"
                onClick={() => setConfirmDelete(false)}
                title="Cancel"
              >
                <Icon name="close" size={13} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="budget-action-btn"
                onClick={() =>
                  onEdit({
                    id: budget.id,
                    category: budget.category,
                    limit: budget.limit,
                    month: budget.month,
                    year: budget.year,
                  })
                }
                title="Edit budget"
                aria-label={`Edit ${budget.category} budget`}
              >
                <Icon name="edit" size={15} />
              </button>
              <button
                type="button"
                className="budget-action-btn delete"
                onClick={() => setConfirmDelete(true)}
                title="Delete budget"
                aria-label={`Delete ${budget.category} budget`}
              >
                <Icon name="trash" size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="budget-card-amounts">
        <div className="budget-spent-block">
          <span className="amount-label">Spent</span>
          <strong className="amount-value">{spentFormatted}</strong>
        </div>

        <div className="budget-limit-block">
          <span className="amount-label">Limit</span>
          <strong className="amount-value muted">{limitFormatted}</strong>
        </div>

        <div className="budget-remaining-block">
          <span className="amount-label">
            {isOver ? "Over Budget" : "Remaining"}
          </span>
          <strong
            className={`amount-value ${
              isOver ? "text-danger" : isWarning ? "text-warning" : "text-success"
            }`}
          >
            {isOver
              ? formatCurrency(budget.spent - budget.limit, currencySymbol)
              : remainingFormatted}
          </strong>
        </div>
      </div>

      <div className="budget-card-progress">
        <div className="progress-track">
          <div
            className={`progress-fill ${
              isOver ? "progress-alert" : isWarning ? "progress-warning" : ""
            }`}
            style={{ width: `${Math.min(100, budget.percentage)}%` }}
          />
        </div>

        <div className="budget-progress-meta">
          <span className="status-indicator-text">
            {isOver
              ? "Exceeded budget limit"
              : isWarning
              ? "Approaching limit threshold"
              : "Within budget safety"}
          </span>
          <span
            className={`percentage-pill ${
              isOver ? "pill-danger" : isWarning ? "pill-warning" : "pill-normal"
            }`}
          >
            {budget.percentage}% used
          </span>
        </div>
      </div>
    </article>
  );
}
