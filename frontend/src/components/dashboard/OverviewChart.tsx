import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency } from "../../utils/formatters";

export default function OverviewChart() {
  const { monthlyTrends, preferences } = useFinance();
  const isDark = preferences.theme === "dark";

  return (
    <section className="dashboard-card chart-card">
      <div className="card-heading">
        <div>
          <p className="card-kicker">MONTHLY TREND</p>
          <h3>Income vs Expenses</h3>
        </div>

        <span className="chart-period">Last 6 months</span>
      </div>

      <div className="chart-legend">
        <span>
          <i className="legend-dot income-dot" />
          Income
        </span>
        <span>
          <i className="legend-dot expense-dot" />
          Expenses
        </span>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#1e293b" : "#edf2f7"}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
              tickFormatter={(value) => `${preferences.currencySymbol}${value / 1000}k`}
            />
            <Tooltip
              formatter={(value) =>
                formatCurrency(Number(value), preferences.currencySymbol)
              }
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                borderColor: isDark ? "#334155" : "#e2e8f0",
                borderRadius: "10px",
                boxShadow: isDark
                  ? "0 10px 25px rgba(0, 0, 0, 0.6)"
                  : "0 10px 25px rgba(15, 23, 42, 0.08)",
                color: isDark ? "#f8fafc" : "#0f172a",
                fontSize: "12px",
                padding: "8px 12px",
              }}
              itemStyle={{
                color: isDark ? "#f8fafc" : "#0f172a",
                fontSize: "12px",
              }}
              labelStyle={{
                color: isDark ? "#94a3b8" : "#64748b",
                fontWeight: 650,
                fontSize: "11.5px",
                marginBottom: "4px",
              }}
            />
            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke={isDark ? "#34d399" : "#10b981"}
              strokeWidth={3}
              dot={{ r: 4, fill: isDark ? "#34d399" : "#10b981" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke={isDark ? "#f87171" : "#64748b"}
              strokeWidth={3}
              dot={{ r: 4, fill: isDark ? "#f87171" : "#64748b" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
