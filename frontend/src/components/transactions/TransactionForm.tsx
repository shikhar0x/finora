import React, { useState, type FormEvent } from "react";
import Modal from "../ui/Modal";
import SelectField, { type SelectOption } from "../ui/SelectField";
import DateField from "../ui/DateField";
import { useFinance } from "../../context/FinanceContext";
import type { TransactionType } from "../../types/transaction";

interface TransactionFormProps {
  onClose: () => void;
}

const EXPENSE_CATEGORIES: SelectOption[] = [
  { value: "Food", label: "Food & Dining", icon: "category" },
  { value: "Transport", label: "Transport & Fuel", icon: "category" },
  { value: "Shopping", label: "Shopping & Retail", icon: "category" },
  { value: "Bills", label: "Bills & Utilities", icon: "category" },
  { value: "Entertainment", label: "Entertainment", icon: "category" },
  { value: "Healthcare", label: "Healthcare", icon: "category" },
  { value: "Education", label: "Education", icon: "category" },
  { value: "Other", label: "Other Expense", icon: "category" },
];

const INCOME_CATEGORIES: SelectOption[] = [
  { value: "Salary", label: "Monthly Salary", icon: "income" },
  { value: "Freelance", label: "Freelance / Consulting", icon: "income" },
  { value: "Allowance", label: "Allowance / Grant", icon: "income" },
  { value: "Other", label: "Other Income", icon: "income" },
];

const PAYMENT_METHODS: SelectOption[] = [
  { value: "UPI", label: "UPI Payment", icon: "credit-card" },
  { value: "Cash", label: "Cash", icon: "cash" },
  { value: "Card", label: "Debit / Credit Card", icon: "credit-card" },
  { value: "Bank Transfer", label: "Bank Transfer", icon: "bank" },
];

export default function TransactionForm({ onClose }: TransactionFormProps) {
  const { addTransaction, preferences } = useFinance();

  const [type, setType] = useState<TransactionType>(preferences.defaultTransactionType || "EXPENSE");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("2026-09-22");
  const [category, setCategory] = useState(type === "EXPENSE" ? "Food" : "Salary");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === "EXPENSE" ? "Food" : "Salary");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a transaction description");
      return;
    }

    addTransaction({
      description: description.trim(),
      amount: parsedAmount,
      type,
      category,
      date,
      paymentMethod,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const categoryOptions = type === "EXPENSE" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <Modal
      title="Add Transaction"
      kicker="MONEY FLOW"
      onClose={onClose}
    >
      <form className="transaction-form" onSubmit={handleSubmit}>
        {error && (
          <div className="form-error-alert" role="alert">
            {error}
          </div>
        )}

        {/* Type Toggle */}
        <div className="transaction-type-toggle" role="group" aria-label="Transaction Type">
          <button
            type="button"
            className={type === "EXPENSE" ? "selected" : ""}
            onClick={() => handleTypeChange("EXPENSE")}
          >
            Expense
          </button>

          <button
            type="button"
            className={type === "INCOME" ? "selected" : ""}
            onClick={() => handleTypeChange("INCOME")}
          >
            Income
          </button>
        </div>

        {/* Description */}
        <div className="form-field-group">
          <label htmlFor="tx-description" className="input-label">
            Description <span className="required-star">*</span>
          </label>
          <input
            id="tx-description"
            type="text"
            className="themed-input"
            placeholder={type === "EXPENSE" ? "e.g. Grocery Shopping" : "e.g. Monthly Salary"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* Amount & Date in a responsive row */}
        <div className="form-row">
          <div className="form-field-group">
            <label htmlFor="tx-amount" className="input-label">
              Amount ({preferences.currencySymbol}) <span className="required-star">*</span>
            </label>
            <input
              id="tx-amount"
              type="number"
              min="0.01"
              step="any"
              className="themed-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <DateField
            label="Date"
            value={date}
            onChange={setDate}
            required
          />
        </div>

        {/* Category & Payment Method */}
        <div className="form-row">
          <SelectField
            label="Category"
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            required
          />

          <SelectField
            label="Payment Method"
            value={paymentMethod}
            onChange={setPaymentMethod}
            options={PAYMENT_METHODS}
            required
          />
        </div>

        {/* Notes */}
        <div className="form-field-group">
          <label htmlFor="tx-notes" className="input-label">
            Notes (Optional)
          </label>
          <textarea
            id="tx-notes"
            className="themed-textarea"
            placeholder="Add any additional details or tags..."
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button className="primary-button" type="submit">
            Add {type === "EXPENSE" ? "Expense" : "Income"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
