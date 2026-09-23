import React, { useState, type FormEvent } from "react";
import Icon from "../components/ui/Icon";
import Modal from "../components/ui/Modal";
import SelectField, { type SelectOption } from "../components/ui/SelectField";
import DateField from "../components/ui/DateField";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency, formatDate } from "../utils/formatters";
import type {
  RecurringTransaction,
  RecurringFrequency,
} from "../types/recurringTransaction";
import type { TransactionType } from "../types/transaction";

const FREQUENCY_OPTIONS: SelectOption[] = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "YEARLY", label: "Yearly" },
];

export default function RecurringTransactions() {
  const {
    recurringTransactions,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    toggleRecurringTransaction,
    categories,
    accounts,
    paymentMethods,
    getAccountById,
    getCategoryById,
    getPaymentMethodById,
    preferences,
  } = useFinance();

  const [showModal, setShowModal] = useState(false);
  const [editingRecurring, setEditingRecurring] =
    useState<RecurringTransaction | null>(null);

  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<RecurringFrequency>("MONTHLY");
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("");
  const [accountId, setAccountId] = useState<string>(
    accounts[0] ? String(accounts[0].id) : "1"
  );
  const filteredCategories = categories.filter((c) => c.type === type);
  const [categoryId, setCategoryId] = useState<string>(
    filteredCategories[0] ? String(filteredCategories[0].id) : "1"
  );
  const [paymentMethodId, setPaymentMethodId] = useState<string>(
    paymentMethods[0] ? String(paymentMethods[0].id) : "1"
  );
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  const handleOpenCreate = () => {
    setEditingRecurring(null);
    setType("EXPENSE");
    setDescription("");
    setAmount("");
    setFrequency("MONTHLY");
    setStartDate("2026-09-01");
    setEndDate("");
    setAccountId(accounts[0] ? String(accounts[0].id) : "1");
    const initCat = categories.filter((c) => c.type === "EXPENSE")[0];
    setCategoryId(initCat ? String(initCat.id) : "1");
    setPaymentMethodId(paymentMethods[0] ? String(paymentMethods[0].id) : "1");
    setIsActive(true);
    setError("");
    setShowModal(true);
  };

  const handleOpenEdit = (rec: RecurringTransaction) => {
    setEditingRecurring(rec);
    setType(rec.type);
    setDescription(rec.description || "");
    setAmount(String(rec.amount));
    setFrequency(rec.frequency);
    setStartDate(rec.startDate);
    setEndDate(rec.endDate || "");
    setAccountId(String(rec.accountId));
    setCategoryId(String(rec.categoryId));
    setPaymentMethodId(rec.paymentMethodId ? String(rec.paymentMethodId) : "1");
    setIsActive(rec.isActive);
    setError("");
    setShowModal(true);
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const newFiltered = categories.filter((c) => c.type === newType);
    if (newFiltered.length > 0) {
      setCategoryId(String(newFiltered[0].id));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Please enter a description for the recurring schedule");
      return;
    }

    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (editingRecurring) {
      updateRecurringTransaction(editingRecurring.id, {
        type,
        description: description.trim(),
        amount: amtNum,
        frequency,
        startDate,
        endDate: endDate || undefined,
        accountId: Number(accountId),
        categoryId: Number(categoryId),
        paymentMethodId: paymentMethodId ? Number(paymentMethodId) : undefined,
        isActive,
      });
    } else {
      addRecurringTransaction({
        userId: 1,
        type,
        description: description.trim(),
        amount: amtNum,
        frequency,
        startDate,
        endDate: endDate || undefined,
        accountId: Number(accountId),
        categoryId: Number(categoryId),
        paymentMethodId: paymentMethodId ? Number(paymentMethodId) : undefined,
        isActive,
      });
    }

    setShowModal(false);
  };

  const sym = preferences.currencySymbol;
  const activeCount = recurringTransactions.filter((r) => r.isActive).length;
  const monthlyCommitted = recurringTransactions.reduce((sum, r) => {
    if (!r.isActive || r.type !== "EXPENSE") return sum;
    if (r.frequency === "MONTHLY") return sum + r.amount;
    if (r.frequency === "YEARLY") return sum + Math.round(r.amount / 12);
    if (r.frequency === "WEEKLY") return sum + Math.round(r.amount * 4);
    return sum + r.amount;
  }, 0);

  const categoryOptions: SelectOption[] = filteredCategories.map((c) => ({
    value: String(c.id),
    label: c.name,
    icon: type === "EXPENSE" ? "category" : "income",
  }));

  const accountOptions: SelectOption[] = accounts.map((a) => ({
    value: String(a.id),
    label: a.accountName,
    icon: "bank",
  }));

  const paymentMethodOptions: SelectOption[] = paymentMethods.map((p) => ({
    value: String(p.id),
    label: p.methodName,
    icon: "credit-card",
  }));

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="page-kicker">AUTOMATED SCHEDULES</p>
          <h2>Recurring Transactions</h2>
          <p>Manage subscription commitments, recurring bills, and automatic salary cycles.</p>
        </div>

        <button
          className="primary-button add-btn"
          type="button"
          onClick={handleOpenCreate}
        >
          <Icon name="plus" size={16} strokeWidth={2.4} />
          <span>New Schedule</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-card-top">
            <span>Active Recurring Plans</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="recurring" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{activeCount} of {recurringTransactions.length}</strong>
          <p className="stat-change positive">Currently automated</p>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span>Committed Monthly Expense</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="expense" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{formatCurrency(monthlyCommitted, sym)}</strong>
          <p className="stat-change positive">Fixed baseline outflow</p>
        </article>
      </div>

      {/* Recurring List */}
      <div className="budgets-section">
        <div className="section-subheading">
          <h3>Scheduled Transactions</h3>
          <span className="section-badge">{recurringTransactions.length} Schedules</span>
        </div>

        <div className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Frequency</th>
                <th>Account</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th>Type</th>
                <th>Start Date</th>
                <th className="amount-column">Amount</th>
                <th>Status</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>

            <tbody>
              {recurringTransactions.map((rec) => {
                const isIncome = rec.type === "INCOME";
                const cat = getCategoryById(rec.categoryId);
                const acc = getAccountById(rec.accountId);
                const pm = getPaymentMethodById(rec.paymentMethodId);

                const categoryName = cat ? cat.name : `Category ${rec.categoryId}`;
                const accountName = acc ? acc.accountName : `Account ${rec.accountId}`;
                const paymentName = pm ? pm.methodName : "—";
                const formattedAmount = formatCurrency(rec.amount, sym);

                return (
                  <tr key={rec.id} className={!rec.isActive ? "row-dimmed" : ""}>
                    <td>
                      <div className="table-description">
                        <span
                          className={`table-transaction-icon ${
                            isIncome ? "icon-income-bg" : "icon-expense-bg"
                          }`}
                        >
                          <Icon
                            name={isIncome ? "income" : "expense"}
                            size={14}
                            strokeWidth={2.2}
                          />
                        </span>
                        <strong>{rec.description || "Recurring Item"}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="frequency-pill">{rec.frequency}</span>
                    </td>

                    <td>
                      <span className="account-tag">
                        <Icon name="bank" size={13} />
                        {accountName}
                      </span>
                    </td>

                    <td>
                      <span className="category-badge">{categoryName}</span>
                    </td>

                    <td>
                      <span className="payment-method-tag">{paymentName}</span>
                    </td>

                    <td>
                      <span
                        className={`type-badge ${
                          isIncome ? "income-badge" : "expense-badge"
                        }`}
                      >
                        {isIncome ? "Income" : "Expense"}
                      </span>
                    </td>

                    <td>{formatDate(rec.startDate, preferences.dateFormat)}</td>

                    <td
                      className={`amount-column ${
                        isIncome ? "amount-income" : "amount-expense"
                      }`}
                    >
                      {isIncome ? `+${formattedAmount}` : `-${formattedAmount}`}
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`status-toggle-btn ${
                          rec.isActive ? "active-status" : "paused-status"
                        }`}
                        onClick={() => toggleRecurringTransaction(rec.id)}
                        title={rec.isActive ? "Click to Pause" : "Click to Activate"}
                      >
                        <Icon name={rec.isActive ? "pause" : "play"} size={12} />
                        <span>{rec.isActive ? "Active" : "Paused"}</span>
                      </button>
                    </td>

                    <td className="actions-column">
                      <button
                        type="button"
                        className="table-action-btn"
                        onClick={() => handleOpenEdit(rec)}
                        title="Edit schedule"
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        type="button"
                        className="table-action-btn delete"
                        onClick={() => deleteRecurringTransaction(rec.id)}
                        title="Delete schedule"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recurring Modal */}
      {showModal && (
        <Modal
          title={
            editingRecurring
              ? "Edit Recurring Transaction"
              : "Create Recurring Schedule"
          }
          kicker="AUTOMATION"
          onClose={() => setShowModal(false)}
        >
          <form className="transaction-form" onSubmit={handleSubmit}>
            {error && (
              <div className="form-error-alert" role="alert">
                {error}
              </div>
            )}

            {/* Type Toggle */}
            <div
              className="transaction-type-toggle"
              role="group"
              aria-label="Transaction Type"
            >
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

            <div className="form-field-group">
              <label htmlFor="rec-desc" className="input-label">
                Description <span className="required-star">*</span>
              </label>
              <input
                id="rec-desc"
                type="text"
                className="themed-input"
                placeholder="e.g. Netflix Subscription, Apartment Rent"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-row">
              <div className="form-field-group">
                <label htmlFor="rec-amt" className="input-label">
                  Amount ({sym}) <span className="required-star">*</span>
                </label>
                <input
                  id="rec-amt"
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

              <SelectField
                label="Frequency"
                value={frequency}
                onChange={(val) => setFrequency(val as RecurringFrequency)}
                options={FREQUENCY_OPTIONS}
                required
              />
            </div>

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

            <div className="form-row">
              <SelectField
                label="Payment Method"
                value={paymentMethodId}
                onChange={setPaymentMethodId}
                options={paymentMethodOptions}
                required
              />

              <DateField
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                required
              />
            </div>

            <div className="modal-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="primary-button" type="submit">
                {editingRecurring ? "Save Schedule" : "Create Schedule"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
