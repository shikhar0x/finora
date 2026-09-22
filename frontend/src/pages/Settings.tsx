import React, { useState, type FormEvent } from "react";
import SelectField, { type SelectOption } from "../components/ui/SelectField";
import Icon from "../components/ui/Icon";
import Modal from "../components/ui/Modal";
import { useFinance } from "../context/FinanceContext";
import type { CurrencyCode, DateFormatOption } from "../types/settings";

const CURRENCY_OPTIONS: SelectOption[] = [
  { value: "INR", label: "INR (₹) — Indian Rupee", icon: "rupee" },
  { value: "USD", label: "USD ($) — US Dollar", icon: "dollar-sign" },
  { value: "EUR", label: "EUR (€) — Euro", icon: "wallet" },
  { value: "GBP", label: "GBP (£) — British Pound", icon: "wallet" },
];

const DATE_FORMAT_OPTIONS: SelectOption[] = [
  { value: "DD MMM YYYY", label: "22 Sep 2026 (DD MMM YYYY)", icon: "calendar" },
  { value: "YYYY-MM-DD", label: "2026-09-22 (ISO Standard)", icon: "calendar" },
  { value: "DD/MM/YYYY", label: "22/09/2026 (DD/MM/YYYY)", icon: "calendar" },
  { value: "MM/DD/YYYY", label: "09/22/2026 (MM/DD/YYYY)", icon: "calendar" },
];

const DEFAULT_TYPE_OPTIONS: SelectOption[] = [
  { value: "EXPENSE", label: "Expense (Recommended)", icon: "expense" },
  { value: "INCOME", label: "Income", icon: "income" },
];

const THEME_OPTIONS: SelectOption[] = [
  { value: "light", label: "Finora Clean Light", icon: "sun" },
  { value: "dark", label: "Deep Navy Dark", icon: "moon" },
  { value: "system", label: "System Default", icon: "settings" },
];

export default function Settings() {
  const {
    userProfile,
    preferences,
    updateUserProfile,
    updatePreferences,
    resetDataToDefault,
  } = useFinance();

  // Profile Form State
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);

  // Preferences Form State
  const [currency, setCurrency] = useState<CurrencyCode>(preferences.currency);
  const [dateFormat, setDateFormat] = useState<DateFormatOption>(preferences.dateFormat);
  const [defaultType, setDefaultType] = useState<"EXPENSE" | "INCOME">(
    preferences.defaultTransactionType
  );
  const [theme, setTheme] = useState<"light" | "dark" | "system">(preferences.theme);

  // Status feedback
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [prefSuccess, setPrefSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleThemeChange = (val: string) => {
    const newTheme = val as "light" | "dark" | "system";
    setTheme(newTheme);
    updatePreferences({ theme: newTheme });
  };

  const handlePreferencesSubmit = (e: FormEvent) => {
    e.preventDefault();
    updatePreferences({
      currency,
      dateFormat,
      defaultTransactionType: defaultType,
      theme,
    });
    setPrefSuccess(true);
    setTimeout(() => setPrefSuccess(false), 3000);
  };

  const handleResetConfirm = () => {
    resetDataToDefault();
    setName("Shikhar");
    setEmail("shikhar@finora.app");
    setCurrency("INR");
    setDateFormat("DD MMM YYYY");
    setDefaultType("EXPENSE");
    setTheme("light");
    setShowResetModal(false);
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="page-kicker">CONFIGURATION</p>
          <h2>Settings & Preferences</h2>
          <p>Manage your account profile, financial formatting, and application options.</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Profile Settings Card */}
        <section className="dashboard-card settings-card">
          <div className="card-heading">
            <div>
              <p className="card-kicker">USER PROFILE</p>
              <h3>Personal Account</h3>
            </div>
            <div className="settings-avatar-pill">
              <span className="avatar-letter">{name.charAt(0).toUpperCase() || "U"}</span>
            </div>
          </div>

          <form className="settings-form" onSubmit={handleProfileSubmit}>
            {profileSuccess && (
              <div className="form-success-alert" role="status">
                <Icon name="check" size={15} strokeWidth={2.5} />
                <span>Profile updated successfully in frontend state.</span>
              </div>
            )}

            <div className="form-field-group">
              <label htmlFor="profile-name" className="input-label">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                id="profile-name"
                type="text"
                className="themed-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-field-group">
              <label htmlFor="profile-email" className="input-label">
                Email Address <span className="required-star">*</span>
              </label>
              <input
                id="profile-email"
                type="email"
                className="themed-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field-group">
              <label className="input-label">Account Role</label>
              <input
                type="text"
                className="themed-input disabled"
                value={userProfile.role}
                disabled
              />
              <span className="field-hint">
                Authentication and multi-user management will be enabled in FA2.
              </span>
            </div>

            <div className="settings-card-actions">
              <button className="primary-button" type="submit">
                Save Profile
              </button>
            </div>
          </form>
        </section>

        {/* Financial Preferences Card */}
        <section className="dashboard-card settings-card">
          <div className="card-heading">
            <div>
              <p className="card-kicker">LOCALIZATION & THEMES</p>
              <h3>Financial Preferences</h3>
            </div>
          </div>

          <form className="settings-form" onSubmit={handlePreferencesSubmit}>
            {prefSuccess && (
              <div className="form-success-alert" role="status">
                <Icon name="check" size={15} strokeWidth={2.5} />
                <span>Preferences saved successfully.</span>
              </div>
            )}

            <SelectField
              label="Visual Theme"
              value={theme}
              onChange={handleThemeChange}
              options={THEME_OPTIONS}
            />

            <SelectField
              label="Primary Currency"
              value={currency}
              onChange={(val) => setCurrency(val as CurrencyCode)}
              options={CURRENCY_OPTIONS}
            />

            <SelectField
              label="Date Display Format"
              value={dateFormat}
              onChange={(val) => setDateFormat(val as DateFormatOption)}
              options={DATE_FORMAT_OPTIONS}
            />

            <SelectField
              label="Default New Transaction Type"
              value={defaultType}
              onChange={(val) => setDefaultType(val as "EXPENSE" | "INCOME")}
              options={DEFAULT_TYPE_OPTIONS}
            />

            <div className="settings-card-actions">
              <button className="primary-button" type="submit">
                Save Preferences
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Demo Data Management Card */}
      <div className="settings-bottom-section">
        <section className="dashboard-card settings-card danger-zone-card">
          <div className="card-heading">
            <div>
              <p className="card-kicker">DEMO DATA & STORAGE</p>
              <h3>Reset Application State</h3>
            </div>
          </div>

          <div className="danger-zone-content">
            <p>
              Restore the initial FA1 sample dataset with standard transactions, category limits,
              and settings. This will discard any mock transactions added during this session.
            </p>
            <button
              type="button"
              className="danger-button"
              onClick={() => setShowResetModal(true)}
            >
              <Icon name="refresh" size={15} />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </section>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <Modal
          title="Reset to Initial Sample Data?"
          kicker="DATA MANAGEMENT"
          onClose={() => setShowResetModal(false)}
        >
          <div className="reset-modal-content">
            <p>
              This will reset all transactions, category budgets, and preferences back to the
              initial FA1 submission demo dataset.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={handleResetConfirm}
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
