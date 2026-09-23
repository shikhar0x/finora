import React, { useState, type FormEvent } from "react";
import Icon from "../components/ui/Icon";
import Modal from "../components/ui/Modal";
import SelectField, { type SelectOption } from "../components/ui/SelectField";
import DateField from "../components/ui/DateField";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency, formatDate } from "../utils/formatters";
import type { Goal, GoalStatus } from "../types/goal";

const GOAL_STATUS_OPTIONS: SelectOption[] = [
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "ACHIEVED", label: "Achieved" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function Goals() {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    preferences,
  } = useFinance();

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("2026-12-31");
  const [status, setStatus] = useState<GoalStatus>("IN_PROGRESS");
  const [error, setError] = useState("");

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setGoalName("");
    setTargetAmount("");
    setCurrentAmount("0");
    setTargetDate("2026-12-31");
    setStatus("IN_PROGRESS");
    setError("");
    setShowModal(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalName(goal.goalName);
    setTargetAmount(String(goal.targetAmount));
    setCurrentAmount(String(goal.currentAmount));
    setTargetDate(goal.targetDate || "2026-12-31");
    setStatus(goal.status);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!goalName.trim()) {
      setError("Please enter a goal name");
      return;
    }

    const targetNum = parseFloat(targetAmount);
    if (isNaN(targetNum) || targetNum <= 0) {
      setError("Please enter a valid target amount greater than 0");
      return;
    }

    const currentNum = parseFloat(currentAmount) || 0;
    if (currentNum < 0) {
      setError("Current saved amount cannot be negative");
      return;
    }

    if (editingGoal) {
      updateGoal(editingGoal.id, {
        goalName: goalName.trim(),
        targetAmount: targetNum,
        currentAmount: currentNum,
        targetDate: targetDate || undefined,
        status,
      });
    } else {
      addGoal({
        userId: 1,
        goalName: goalName.trim(),
        targetAmount: targetNum,
        currentAmount: currentNum,
        targetDate: targetDate || undefined,
        status,
      });
    }

    setShowModal(false);
  };

  const sym = preferences.currencySymbol;
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const achievedGoals = goals.filter((g) => g.status === "ACHIEVED").length;
  const overallProgress =
    totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="page-kicker">SAVINGS TARGETS</p>
          <h2>Financial Goals</h2>
          <p>Set, track, and accomplish your long-term personal savings goals.</p>
        </div>

        <button
          className="primary-button add-btn"
          type="button"
          onClick={handleOpenCreate}
        >
          <Icon name="plus" size={16} strokeWidth={2.4} />
          <span>Create Goal</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-card-top">
            <span>Total Target Amount</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="goals" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{formatCurrency(totalTarget, sym)}</strong>
          <p className="stat-change positive">Across {goals.length} active goals</p>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span>Total Saved Towards Goals</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="savings" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{formatCurrency(totalSaved, sym)}</strong>
          <p className="stat-change positive">{overallProgress}% funded so far</p>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span>Accomplished Goals</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="check-circle" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{achievedGoals} of {goals.length}</strong>
          <p className="stat-change positive">Fully completed targets</p>
        </article>
      </div>

      {/* Goals Cards Grid */}
      <div className="budgets-section">
        <div className="section-subheading">
          <h3>Your Goals</h3>
          <span className="section-badge">{goals.length} Goals</span>
        </div>

        {goals.length === 0 ? (
          <div className="empty-dashboard">
            <div className="empty-icon-circle">
              <Icon name="goals" size={26} />
            </div>
            <h3>No savings goals yet</h3>
            <p>Create your first goal to begin tracking your financial milestones.</p>
            <button
              className="primary-button add-btn"
              type="button"
              onClick={handleOpenCreate}
              style={{ marginTop: "16px" }}
            >
              <Icon name="plus" size={16} strokeWidth={2.4} />
              <span>Create First Goal</span>
            </button>
          </div>
        ) : (
          <div className="budget-cards-grid">
            {goals.map((goal) => {
              const pct =
                goal.targetAmount > 0
                  ? Math.min(
                      100,
                      Math.round((goal.currentAmount / goal.targetAmount) * 100)
                    )
                  : 0;
              const isDone = goal.status === "ACHIEVED" || pct >= 100;

              return (
                <article className="budget-card-item" key={goal.id}>
                  <div className="budget-card-header">
                    <div className="budget-card-title-group">
                      <div className="budget-card-icon">
                        <Icon name="goals" size={16} strokeWidth={2} />
                      </div>
                      <div>
                        <h4>{goal.goalName}</h4>
                        <span className="budget-month-label">
                          {goal.targetDate
                            ? `Target: ${formatDate(
                                goal.targetDate,
                                preferences.dateFormat
                              )}`
                            : "Ongoing Target"}
                        </span>
                      </div>
                    </div>

                    <div className="budget-card-actions">
                      <button
                        type="button"
                        className="budget-action-btn"
                        onClick={() => handleOpenEdit(goal)}
                        title="Edit goal"
                      >
                        <Icon name="edit" size={15} />
                      </button>
                      <button
                        type="button"
                        className="budget-action-btn delete"
                        onClick={() => deleteGoal(goal.id)}
                        title="Delete goal"
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="budget-card-amounts">
                    <div className="budget-spent-block">
                      <span className="amount-label">Saved</span>
                      <strong className="amount-value text-success">
                        {formatCurrency(goal.currentAmount, sym)}
                      </strong>
                    </div>

                    <div className="budget-limit-block">
                      <span className="amount-label">Target</span>
                      <strong className="amount-value muted">
                        {formatCurrency(goal.targetAmount, sym)}
                      </strong>
                    </div>

                    <div className="budget-remaining-block">
                      <span className="amount-label">Remaining</span>
                      <strong className="amount-value">
                        {formatCurrency(
                          Math.max(0, goal.targetAmount - goal.currentAmount),
                          sym
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="budget-card-progress">
                    <div className="progress-track">
                      <div
                        className={`progress-fill ${
                          isDone ? "progress-success" : ""
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="budget-progress-meta">
                      <span className="status-indicator-text">
                        {goal.status === "ACHIEVED"
                          ? "Goal Achieved!"
                          : goal.status === "CANCELLED"
                          ? "Goal Cancelled"
                          : `${pct}% completed`}
                      </span>
                      <span
                        className={`percentage-pill ${
                          isDone ? "pill-normal" : "pill-warning"
                        }`}
                      >
                        {goal.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal Modal */}
      {showModal && (
        <Modal
          title={editingGoal ? "Edit Goal" : "Create Financial Goal"}
          kicker="SAVINGS TARGETS"
          onClose={() => setShowModal(false)}
        >
          <form className="transaction-form" onSubmit={handleSubmit}>
            {error && (
              <div className="form-error-alert" role="alert">
                {error}
              </div>
            )}

            <div className="form-field-group">
              <label htmlFor="goal-name" className="input-label">
                Goal Name <span className="required-star">*</span>
              </label>
              <input
                id="goal-name"
                type="text"
                className="themed-input"
                placeholder="e.g. Emergency Fund, Laptop Upgrade"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-row">
              <div className="form-field-group">
                <label htmlFor="goal-target" className="input-label">
                  Target Amount ({sym}) <span className="required-star">*</span>
                </label>
                <input
                  id="goal-target"
                  type="number"
                  step="any"
                  className="themed-input"
                  placeholder="e.g. 100000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-field-group">
                <label htmlFor="goal-current" className="input-label">
                  Current Amount ({sym})
                </label>
                <input
                  id="goal-current"
                  type="number"
                  step="any"
                  className="themed-input"
                  placeholder="0.00"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <DateField
                label="Target Date"
                value={targetDate}
                onChange={setTargetDate}
              />

              <SelectField
                label="Status"
                value={status}
                onChange={(val) => setStatus(val as GoalStatus)}
                options={GOAL_STATUS_OPTIONS}
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
                {editingGoal ? "Save Changes" : "Create Goal"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
