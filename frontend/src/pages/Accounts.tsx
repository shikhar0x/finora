import React, { useState, type FormEvent } from "react";
import Icon from "../components/ui/Icon";
import Modal from "../components/ui/Modal";
import SelectField, { type SelectOption } from "../components/ui/SelectField";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency } from "../utils/formatters";
import type { Account, AccountType } from "../types/account";
import type { PaymentMethod } from "../types/paymentMethod";

const ACCOUNT_TYPE_OPTIONS: SelectOption[] = [
  { value: "SAVINGS", label: "Savings Account" },
  { value: "CHECKING", label: "Checking Account" },
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "CASH", label: "Cash Wallet" },
  { value: "INVESTMENT", label: "Investment / Demat" },
  { value: "WALLET", label: "Digital Wallet" },
  { value: "OTHER", label: "Other" },
];

export default function Accounts() {
  const {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    paymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    preferences,
  } = useFinance();

  // Account Modal State
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("SAVINGS");
  const [currentBalance, setCurrentBalance] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [accountError, setAccountError] = useState("");

  // Payment Method Modal State
  const [showPmModal, setShowPmModal] = useState(false);
  const [methodName, setMethodName] = useState("");
  const [pmDetails, setPmDetails] = useState("");
  const [pmError, setPmError] = useState("");

  // Open Add Account
  const handleOpenAddAccount = () => {
    setEditingAccount(null);
    setAccountName("");
    setAccountType("SAVINGS");
    setCurrentBalance("");
    setCurrency(preferences.currency || "INR");
    setAccountError("");
    setShowAccountModal(true);
  };

  // Open Edit Account
  const handleOpenEditAccount = (acc: Account) => {
    setEditingAccount(acc);
    setAccountName(acc.accountName);
    setAccountType(acc.accountType);
    setCurrentBalance(String(acc.currentBalance));
    setCurrency(acc.currency);
    setAccountError("");
    setShowAccountModal(true);
  };

  // Submit Account Form
  const handleAccountSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAccountError("");

    if (!accountName.trim()) {
      setAccountError("Please enter an account name");
      return;
    }

    const balanceNum = parseFloat(currentBalance);
    if (isNaN(balanceNum)) {
      setAccountError("Please enter a valid initial balance");
      return;
    }

    if (editingAccount) {
      updateAccount(editingAccount.id, {
        accountName: accountName.trim(),
        accountType,
        currentBalance: balanceNum,
        currency,
      });
    } else {
      addAccount({
        userId: 1,
        accountName: accountName.trim(),
        accountType,
        currentBalance: balanceNum,
        currency,
      });
    }

    setShowAccountModal(false);
  };

  // Submit Payment Method Form
  const handlePmSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPmError("");

    if (!methodName.trim()) {
      setPmError("Please enter a payment method name");
      return;
    }

    addPaymentMethod({
      userId: 1,
      methodName: methodName.trim(),
      details: pmDetails.trim() || undefined,
    });

    setMethodName("");
    setPmDetails("");
    setShowPmModal(false);
  };

  const totalAssets = accounts.reduce(
    (sum, a) => (a.currentBalance > 0 ? sum + a.currentBalance : sum),
    0
  );
  const totalLiabilities = accounts.reduce(
    (sum, a) => (a.currentBalance < 0 ? sum + Math.abs(a.currentBalance) : sum),
    0
  );
  const netWorth = totalAssets - totalLiabilities;
  const sym = preferences.currencySymbol;

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="page-kicker">FINANCIAL ACCOUNTS</p>
          <h2>Accounts & Payment Methods</h2>
          <p>Manage your linked bank accounts, wallets, and payment instruments.</p>
        </div>

        <div className="page-heading-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              setMethodName("");
              setPmDetails("");
              setPmError("");
              setShowPmModal(true);
            }}
          >
            <Icon name="plus" size={15} strokeWidth={2.4} />
            <span>Add Payment Method</span>
          </button>

          <button
            className="primary-button add-btn"
            type="button"
            onClick={handleOpenAddAccount}
          >
            <Icon name="plus" size={16} strokeWidth={2.4} />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-card-top">
            <span>Total Liquid Assets</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="wallet" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{formatCurrency(totalAssets, sym)}</strong>
          <p className="stat-change positive">Across {accounts.length} active accounts</p>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span>Liabilities & Cards</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="credit-card" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong className={totalLiabilities > 0 ? "text-danger" : ""}>
            {formatCurrency(totalLiabilities, sym)}
          </strong>
          <p className={totalLiabilities > 0 ? "stat-change negative" : "stat-change positive"}>
            {totalLiabilities > 0 ? "Outstanding card credit" : "Zero liabilities"}
          </p>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span>Net Financial Balance</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="bank" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{formatCurrency(netWorth, sym)}</strong>
          <p className="stat-change positive">Total calculated net worth</p>
        </article>
      </div>

      {/* Accounts List Section */}
      <div className="budgets-section">
        <div className="section-subheading">
          <h3>Active Accounts</h3>
          <span className="section-badge">{accounts.length} Accounts</span>
        </div>

        <div className="accounts-grid">
          {accounts.map((acc) => (
            <article className="account-card" key={acc.id}>
              <div className="account-card-header">
                <div className="account-card-title-group">
                  <div className="account-card-icon">
                    <Icon
                      name={
                        acc.accountType === "CREDIT_CARD"
                          ? "credit-card"
                          : acc.accountType === "CASH"
                          ? "cash"
                          : "bank"
                      }
                      size={18}
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <h4>{acc.accountName}</h4>
                    <span className="account-type-tag">
                      {acc.accountType.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="account-card-actions">
                  <button
                    type="button"
                    className="budget-action-btn"
                    onClick={() => handleOpenEditAccount(acc)}
                    title="Edit account"
                  >
                    <Icon name="edit" size={14} />
                  </button>
                  <button
                    type="button"
                    className="budget-action-btn delete"
                    onClick={() => deleteAccount(acc.id)}
                    title="Delete account"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>

              <div className="account-balance-block">
                <span className="account-balance-label">Current Balance</span>
                <strong
                  className={`account-balance-val ${
                    acc.currentBalance < 0 ? "text-danger" : ""
                  }`}
                >
                  {formatCurrency(acc.currentBalance, sym)}
                </strong>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="budgets-section" style={{ marginTop: "32px" }}>
        <div className="section-subheading">
          <h3>Configured Payment Methods</h3>
          <span className="section-badge">{paymentMethods.length} Methods</span>
        </div>

        <div className="payment-methods-grid">
          {paymentMethods.map((pm) => (
            <article className="payment-method-card" key={pm.id}>
              <div className="pm-icon-wrapper">
                <Icon name="credit-card" size={18} strokeWidth={2} />
              </div>
              <div className="pm-info">
                <strong>{pm.methodName}</strong>
                {pm.details && <span>{pm.details}</span>}
              </div>
              <button
                type="button"
                className="budget-action-btn delete"
                onClick={() => deletePaymentMethod(pm.id)}
                title="Remove method"
              >
                <Icon name="trash" size={14} />
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* Account Modal */}
      {showAccountModal && (
        <Modal
          title={editingAccount ? "Edit Account" : "Add New Account"}
          kicker="FINANCIAL ACCOUNTS"
          onClose={() => setShowAccountModal(false)}
        >
          <form className="transaction-form" onSubmit={handleAccountSubmit}>
            {accountError && (
              <div className="form-error-alert" role="alert">
                {accountError}
              </div>
            )}

            <div className="form-field-group">
              <label htmlFor="acc-name" className="input-label">
                Account Name <span className="required-star">*</span>
              </label>
              <input
                id="acc-name"
                type="text"
                className="themed-input"
                placeholder="e.g. HDFC Salary Account"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-row">
              <SelectField
                label="Account Type"
                value={accountType}
                onChange={(val) => setAccountType(val as AccountType)}
                options={ACCOUNT_TYPE_OPTIONS}
                required
              />

              <div className="form-field-group">
                <label htmlFor="acc-balance" className="input-label">
                  Current Balance ({sym}) <span className="required-star">*</span>
                </label>
                <input
                  id="acc-balance"
                  type="number"
                  step="any"
                  className="themed-input"
                  placeholder="0.00"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowAccountModal(false)}
              >
                Cancel
              </button>
              <button className="primary-button" type="submit">
                {editingAccount ? "Save Changes" : "Create Account"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Payment Method Modal */}
      {showPmModal && (
        <Modal
          title="Add Payment Method"
          kicker="PAYMENT CHANNELS"
          onClose={() => setShowPmModal(false)}
        >
          <form className="transaction-form" onSubmit={handlePmSubmit}>
            {pmError && (
              <div className="form-error-alert" role="alert">
                {pmError}
              </div>
            )}

            <div className="form-field-group">
              <label htmlFor="pm-name" className="input-label">
                Method Name <span className="required-star">*</span>
              </label>
              <input
                id="pm-name"
                type="text"
                className="themed-input"
                placeholder="e.g. UPI, Debit Card, Net Banking"
                value={methodName}
                onChange={(e) => setMethodName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-field-group">
              <label htmlFor="pm-details" className="input-label">
                Details (Optional)
              </label>
              <input
                id="pm-details"
                type="text"
                className="themed-input"
                placeholder="e.g. Primary GPay handle or card bank name"
                value={pmDetails}
                onChange={(e) => setPmDetails(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowPmModal(false)}
              >
                Cancel
              </button>
              <button className="primary-button" type="submit">
                Add Method
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
