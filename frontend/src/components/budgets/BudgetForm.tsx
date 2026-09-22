import React, { useState, type FormEvent } from "react";
import Modal from "../ui/Modal";
import SelectField, { type SelectOption } from "../ui/SelectField";
import { useFinance } from "../../context/FinanceContext";
import type { Budget } from "../../types/budget";

interface BudgetFormProps {
  onClose: () => void;
  existingBudget?: Budget;
}

const MONTH_OPTIONS: SelectOption[] = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const YEAR_OPTIONS: SelectOption[] = [
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
  { value: "2027", label: "2027" },
];

export default function BudgetForm({ onClose, existingBudget }: BudgetFormProps) {
  const { addBudget, updateBudget, categories, preferences } = useFinance();

  const expenseCategories: SelectOption[] = categories
    .filter((c) => c.type === "EXPENSE" || c.type === "BOTH")
    .map((c) => ({ value: c.name, label: c.name, icon: "category" }));

  const [category, setCategory] = useState(
    existingBudget?.category || expenseCategories[0]?.value || "Food"
  );
  const [limit, setLimit] = useState(
    existingBudget ? String(existingBudget.limit) : ""
  );
  const [month, setMonth] = useState(
    existingBudget ? String(existingBudget.month) : "9"
  );
  const [year, setYear] = useState(
    existingBudget ? String(existingBudget.year) : "2026"
  );
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const parsedLimit = parseFloat(limit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      setError("Please enter a valid monthly limit greater than 0");
      return;
    }

    if (existingBudget) {
      updateBudget(existingBudget.id, {
        category,
        limit: parsedLimit,
        month: parseInt(month, 10),
        year: parseInt(year, 10),
      });
    } else {
      addBudget({
        category,
        limit: parsedLimit,
        month: parseInt(month, 10),
        year: parseInt(year, 10),
      });
    }

    onClose();
  };

  return (
    <Modal
      title={existingBudget ? "Edit Category Budget" : "Create Category Budget"}
      kicker="SPENDING LIMITS"
      onClose={onClose}
    >
      <form className="transaction-form" onSubmit={handleSubmit}>
        {error && (
          <div className="form-error-alert" role="alert">
            {error}
          </div>
        )}

        <SelectField
          label="Expense Category"
          value={category}
          onChange={setCategory}
          options={expenseCategories}
          required
        />

        <div className="form-field-group">
          <label htmlFor="budget-limit" className="input-label">
            Monthly Limit ({preferences.currencySymbol}) <span className="required-star">*</span>
          </label>
          <input
            id="budget-limit"
            type="number"
            min="1"
            step="any"
            className="themed-input"
            placeholder="e.g. 5000"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="form-row">
          <SelectField
            label="Month"
            value={month}
            onChange={setMonth}
            options={MONTH_OPTIONS}
            required
          />

          <SelectField
            label="Year"
            value={year}
            onChange={setYear}
            options={YEAR_OPTIONS}
            required
          />
        </div>

        <div className="modal-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button className="primary-button" type="submit">
            {existingBudget ? "Save Changes" : "Create Budget"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
