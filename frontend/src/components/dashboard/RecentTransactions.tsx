import React from "react";
import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency, formatDate } from "../../utils/formatters";

export default function RecentTransactions() {
  const { recentTransactions, getCategoryById, preferences } = useFinance();

  return (
    <section className="dashboard-card transactions-card">
      <div className="card-heading">
        <div>
          <p className="card-kicker">ACTIVITY</p>
          <h3>Recent Transactions</h3>
        </div>

        <Link to="/transactions" className="text-button-link">
          View all
        </Link>
      </div>

      {recentTransactions.length === 0 ? (
        <div className="empty-section-state">
          <p>No recent transactions to display.</p>
        </div>
      ) : (
        <div className="transaction-list">
          {recentTransactions.map((transaction) => {
            const isIncome = transaction.type === "INCOME";
            const cat = getCategoryById(transaction.categoryId);
            const categoryName = cat ? cat.name : "Transaction";
            const formattedAmount = formatCurrency(
              transaction.amount,
              preferences.currencySymbol
            );

            return (
              <div className="transaction-row" key={transaction.id}>
                <div
                  className={`transaction-icon ${
                    isIncome ? "icon-income-bg" : "icon-expense-bg"
                  }`}
                >
                  <Icon
                    name={isIncome ? "income" : "expense"}
                    size={16}
                    strokeWidth={2.2}
                  />
                </div>

                <div className="transaction-info">
                  <strong>{transaction.description || "Untitled Transaction"}</strong>
                  <span>
                    {categoryName} ·{" "}
                    {formatDate(transaction.date, preferences.dateFormat)}
                  </span>
                </div>

                <strong
                  className={
                    isIncome ? "transaction-income" : "transaction-expense"
                  }
                >
                  {isIncome ? `+${formattedAmount}` : `-${formattedAmount}`}
                </strong>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
