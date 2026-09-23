import React, { useState, type FormEvent } from "react";
import Modal from "../ui/Modal";
import SelectField, { type SelectOption } from "../ui/SelectField";
import DateField from "../ui/DateField";
import { useFinance } from "../../context/FinanceContext";
import type { TransactionType } from "../../types/transaction";

interface TransactionFormProps {
  onClose: () => void;
}

export default function TransactionForm({ onClose }: TransactionFormProps) {
  const {
    addTransaction,
    categories,
    accounts,
    paymentMethods,
    preferences,
    userProfile,
  } = useFinance();

  const [type, setType] = useState<TransactionType>(
    preferences.defaultTransactionType || "EXPENSE"
  );
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Default selections
  const filteredCategories = categories.filter((c) => c.type === type);
  const [categoryId, setCategoryId] = useState<string>(
    filteredCategories[0] ? String(filteredCategories[0].id) : "1"
  );
  const [accountId, setAccountId] = useState<string>(
    accounts[0] ? String(accounts[0].id) : "1"
  );
  const [paymentMethodId, setPaymentMethodId] = useState<string>(
    paymentMethods[0] ? String(paymentMethods[0].id) : "1"
  );
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const newFiltered = categories.filter((c) => c.type === newType);
    if (newFiltered.length > 0) {
      setCategoryId(String(newFiltered[0].id));
    }
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
      userId: 1, // Default active user
      accountId: Number(accountId),
      categoryId: Number(categoryId),
      paymentMethodId: paymentMethodId ? Number(paymentMethodId) : undefined,
      type,
      amount: parsedAmount,
      date,
      description: description.trim(),
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const categoryOptions: SelectOption[] = filteredCategories.map((c) => ({
    value: String(c.id),
    label: c.name,
    icon: (c.icon as any) || (type === "EXPENSE" ? "category" : "income"),
  }));

  const accountOptions: SelectOption[] = accounts.map((a) => ({
    value: String(a.id),
    label: `${a.accountName} (${preferences.currencySymbol}${a.currentBalance.toLocaleString()})`,
    icon: "bank",
  }));

  const paymentMethodOptions: SelectOption[] = paymentMethods.map((p) => ({
    value: String(p.id),
    label: p.methodName,
    icon: "credit-card",
  }));

  return (
    <Modal title="Add Transaction" kicker="MONEY FLOW" onClose={onClose}>
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
            placeholder={
              type === "EXPENSE" ? "e.g. Grocery Shopping" : "e.g. Monthly Salary"
            }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* Amount & Date */}
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

          <DateField label="Date" value={date} onChange={setDate} required />
        </div>

        {/* Account & Category Selection */}
        <div className="form-row">
          <SelectField
            label="Account"
            value={accountId}
            onChange={setAccountId}
            options={accountOptions}
            required
          />

          <SelectField
            label="Category"
            value={categoryId}
            onChange={setCategoryId}
            options={categoryOptions}
            required
          />
        </div>

        {/* Payment Method */}
        <div className="form-field-group">
          <SelectField
            label="Payment Method"
            value={paymentMethodId}
            onChange={setPaymentMethodId}
            options={paymentMethodOptions}
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
          <button className="secondary-button" type="button" onClick={onClose}>
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
