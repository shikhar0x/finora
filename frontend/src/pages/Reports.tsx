import React, { useState, useMemo } from "react";
import {
  IncomeExpenseBarChart,
  CategoryPieChart,
  SavingsAreaChart,
} from "../components/reports/ReportCharts";
import SelectField from "../components/ui/SelectField";
import Icon from "../components/ui/Icon";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency } from "../utils/formatters";

const TIMEFRAME_OPTIONS = [
  { value: "6M", label: "Last 6 Months (Apr - Sep 2026)" },
  { value: "3M", label: "Last 3 Months (Jul - Sep 2026)" },
  { value: "1M", label: "Current Month (Sep 2026)" },
];

export default function Reports() {
  const { monthlyTrends, categoryExpenses, preferences } = useFinance();
  const [timeframe, setTimeframe] = useState("6M");

  const sym = preferences.currencySymbol;

  const filteredTrends = useMemo(() => {
    if (timeframe === "3M") return monthlyTrends.slice(-3);
    if (timeframe === "1M") return monthlyTrends.slice(-1);
    return monthlyTrends;
  }, [monthlyTrends, timeframe]);

  // Derived averages
  const { avgIncome, avgExpenses, avgSavings, savingsRate, topCategory } = useMemo(() => {
    if (filteredTrends.length === 0) {
      return {
        avgIncome: 0,
        avgExpenses: 0,
        avgSavings: 0,
        savingsRate: 0,
        topCategory: "None",
      };
    }

    const totalInc = filteredTrends.reduce((sum, item) => sum + item.income, 0);
    const totalExp = filteredTrends.reduce((sum, item) => sum + item.expenses, 0);
    const count = filteredTrends.length;

    const aInc = Math.round(totalInc / count);
    const aExp = Math.round(totalExp / count);
    const aSav = Math.max(0, aInc - aExp);
    const sRate = aInc > 0 ? Math.round((aSav / aInc) * 100) : 0;
    const topCat = categoryExpenses.length > 0 ? categoryExpenses[0].name : "None";

    return {
      avgIncome: aInc,
      avgExpenses: aExp,
      avgSavings: aSav,
      savingsRate: sRate,
      topCategory: topCat,
    };
  }, [filteredTrends, categoryExpenses]);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="page-kicker">FINANCIAL ANALYTICS</p>
          <h2>Reports & Insights</h2>
          <p>Analyze income flows, expense breakdowns, and monthly savings trends.</p>
        </div>

        <div className="page-heading-actions">
          <SelectField
            value={timeframe}
            onChange={setTimeframe}
            options={TIMEFRAME_OPTIONS}
            className="timeframe-filter-select"
          />
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-card-top">
            <span>Avg Monthly Income</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="income" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{formatCurrency(avgIncome, sym)}</strong>
          <p className="stat-change positive">Monthly average</p>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span>Avg Monthly Expenses</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="expense" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{formatCurrency(avgExpenses, sym)}</strong>
          <p className="stat-change positive">Within expected range</p>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span>Net Savings Rate</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="savings" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{savingsRate}%</strong>
          <p className="stat-change positive">{formatCurrency(avgSavings, sym)} / month avg</p>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span>Top Spending Category</span>
            <span className="stat-icon" aria-hidden="true">
              <Icon name="tag" size={17} strokeWidth={2} />
            </span>
          </div>
          <strong>{topCategory}</strong>
          <p className="stat-change positive">
            {categoryExpenses[0] ? `${categoryExpenses[0].percentage}% of total expenses` : "No data"}
          </p>
        </article>
      </div>

      {/* Charts Grid */}
      <div className="dashboard-grid dashboard-grid-top">
        {/* Income vs Expenses Bar Chart */}
        <section className="dashboard-card">
          <div className="card-heading">
            <div>
              <p className="card-kicker">COMPARISON</p>
              <h3>Monthly Income vs Expenses</h3>
            </div>
            <span className="chart-period">Grouped bar comparison</span>
          </div>
          <IncomeExpenseBarChart data={filteredTrends} currencySymbol={sym} />
        </section>

        {/* Category-wise Expenses Donut Chart */}
        <section className="dashboard-card">
          <div className="card-heading">
            <div>
              <p className="card-kicker">BREAKDOWN</p>
              <h3>Category-wise Expenses</h3>
            </div>
            <span className="chart-period">Share by category</span>
          </div>
          <CategoryPieChart data={categoryExpenses} currencySymbol={sym} />
        </section>
      </div>

      {/* Net Savings Trend */}
      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-heading">
            <div>
              <p className="card-kicker">WEALTH ACCUMULATION</p>
              <h3>Monthly Net Savings Trend</h3>
            </div>
            <span className="chart-period">Income minus expenses trajectory</span>
          </div>
          <SavingsAreaChart data={filteredTrends} currencySymbol={sym} />
        </section>
      </div>
    </section>
  );
}
