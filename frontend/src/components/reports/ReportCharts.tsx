import React from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "../../utils/formatters";
import { useFinance } from "../../context/FinanceContext";

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface IncomeExpenseBarProps {
  data: MonthlyData[];
  currencySymbol: string;
}

export function IncomeExpenseBarChart({ data, currencySymbol }: IncomeExpenseBarProps) {
  const { preferences } = useFinance();
  const isDark = preferences.theme === "dark";

  return (
    <div className="chart-wrapper" style={{ height: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
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
            tickFormatter={(value) => `${currencySymbol}${value / 1000}k`}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value), currencySymbol)}
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
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: "10px", fontSize: "12px", color: isDark ? "#cbd5e1" : "#475569" }}
          />
          <Bar
            dataKey="income"
            name="Income"
            fill={isDark ? "#34d399" : "#10b981"}
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill={isDark ? "#f87171" : "#64748b"}
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CategoryPieProps {
  data: CategoryData[];
  currencySymbol: string;
}

export function CategoryPieChart({ data, currencySymbol }: CategoryPieProps) {
  const { preferences } = useFinance();
  const isDark = preferences.theme === "dark";

  return (
    <div className="category-report-container">
      <div className="donut-chart-container" style={{ height: "260px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              stroke={isDark ? "#0f172a" : "#ffffff"}
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value), currencySymbol)}
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
      </div>

      <div className="category-legend-list">
        {data.map((item) => (
          <div className="category-legend-row" key={item.name}>
            <div className="category-legend-label">
              <span
                className="category-color-dot"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
            </div>
            <div className="category-legend-values">
              <strong>{formatCurrency(item.value, currencySymbol)}</strong>
              <span className="category-pct">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SavingsAreaProps {
  data: MonthlyData[];
  currencySymbol: string;
}

export function SavingsAreaChart({ data, currencySymbol }: SavingsAreaProps) {
  const { preferences } = useFinance();
  const isDark = preferences.theme === "dark";

  return (
    <div className="chart-wrapper" style={{ height: "280px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isDark ? "#34d399" : "#10b981"} stopOpacity={0.35} />
              <stop offset="95%" stopColor={isDark ? "#34d399" : "#10b981"} stopOpacity={0.0} />
            </linearGradient>
          </defs>
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
            tickFormatter={(value) => `${currencySymbol}${value / 1000}k`}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value), currencySymbol)}
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
          <Area
            type="monotone"
            dataKey="savings"
            name="Net Savings"
            stroke={isDark ? "#34d399" : "#10b981"}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#savingsGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
