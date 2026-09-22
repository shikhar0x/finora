import React from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency } from "../../utils/formatters";

export default function ExpenseBreakdown() {
  const { categoryExpenses, totalExpenses, preferences } = useFinance();
  const isDark = preferences.theme === "dark";

  const formattedTotal = formatCurrency(totalExpenses, preferences.currencySymbol);

  return (
    <section className="dashboard-card expense-card">
      <div className="card-heading">
        <div>
          <p className="card-kicker">SPENDING</p>
          <h3>Expense Breakdown</h3>
        </div>

        <span className="chart-period">This month</span>
      </div>

      {categoryExpenses.length === 0 ? (
        <div className="empty-chart-state">
          <p>No expenses recorded this month.</p>
        </div>
      ) : (
        <div className="expense-content">
          <div className="donut-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryExpenses}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={3}
                  stroke={isDark ? "#0f172a" : "#ffffff"}
                  strokeWidth={2}
                >
                  {categoryExpenses.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
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
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <strong>{formattedTotal}</strong>
              <span>Total spent</span>
            </div>
          </div>

          <div className="expense-list">
            {categoryExpenses.slice(0, 5).map((item) => (
              <div className="expense-row" key={item.name}>
                <div className="expense-category-name">
                  <span
                    className="category-color-dot"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <strong>
                  {formatCurrency(item.value, preferences.currencySymbol)}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
