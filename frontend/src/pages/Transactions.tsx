import React, { useMemo, useState } from "react";
import TransactionForm from "../components/transactions/TransactionForm";
import SelectField from "../components/ui/SelectField";
import Icon from "../components/ui/Icon";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency, formatDate } from "../utils/formatters";

const ITEMS_PER_PAGE = 6;

export default function Transactions() {
  const { transactions, deleteTransaction, categories, preferences } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Category options for filter
  const categoryFilterOptions = useMemo(() => {
    return [
      { value: "ALL", label: "All Categories" },
      ...categories.map((c) => ({ value: c.name, label: c.name })),
    ];
  }, [categories]);

  const typeFilterOptions = [
    { value: "ALL", label: "All Types" },
    { value: "INCOME", label: "Income Only" },
    { value: "EXPENSE", label: "Expense Only" },
  ];

  const paymentFilterOptions = [
    { value: "ALL", label: "All Methods" },
    { value: "UPI", label: "UPI" },
    { value: "Cash", label: "Cash" },
    { value: "Card", label: "Card" },
    { value: "Bank Transfer", label: "Bank Transfer" },
  ];

  // Filtering
  const filteredTransactions = useMemo(() => {
    const query = search.toLowerCase().trim();

    return transactions.filter((tx) => {
      const matchesSearch =
        !query ||
        tx.description.toLowerCase().includes(query) ||
        tx.category.toLowerCase().includes(query) ||
        (tx.notes && tx.notes.toLowerCase().includes(query));

      const matchesType = typeFilter === "ALL" || tx.type === typeFilter;
      const matchesCategory = categoryFilter === "ALL" || tx.category === categoryFilter;
      const matchesPayment = paymentFilter === "ALL" || tx.paymentMethod === paymentFilter;

      return matchesSearch && matchesType && matchesCategory && matchesPayment;
    });
  }, [transactions, search, typeFilter, categoryFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(
      (safeCurrentPage - 1) * ITEMS_PER_PAGE,
      safeCurrentPage * ITEMS_PER_PAGE
    );
  }, [filteredTransactions, safeCurrentPage]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };

  const handlePaymentChange = (val: string) => {
    setPaymentFilter(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setCategoryFilter("ALL");
    setPaymentFilter("ALL");
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    deleteTransaction(id);
    setDeleteConfirmId(null);
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="page-kicker">MONEY FLOW</p>
          <h2>Transactions</h2>
          <p>View, filter, and organize all your income and expenses.</p>
        </div>

        <button
          className="primary-button add-btn"
          type="button"
          onClick={() => setShowForm(true)}
        >
          <Icon name="plus" size={16} strokeWidth={2.4} />
          <span>Add Transaction</span>
        </button>
      </div>

      <section className="transaction-panel">
        {/* Filter & Search Toolbar */}
        <div className="transaction-toolbar">
          <div className="transaction-search">
            <Icon name="search" size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by description or category..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Search transactions"
            />
            {search && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => handleSearchChange("")}
                aria-label="Clear search"
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>

          <div className="toolbar-dropdowns">
            <SelectField
              value={typeFilter}
              onChange={handleTypeChange}
              options={typeFilterOptions}
              className="toolbar-select"
            />

            <SelectField
              value={categoryFilter}
              onChange={handleCategoryChange}
              options={categoryFilterOptions}
              className="toolbar-select"
            />

            <SelectField
              value={paymentFilter}
              onChange={handlePaymentChange}
              options={paymentFilterOptions}
              className="toolbar-select"
            />
          </div>
        </div>

        {/* Table / List */}
        <div className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th>Type</th>
                <th className="amount-column">Amount</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedTransactions.map((tx) => {
                const isIncome = tx.type === "INCOME";
                const formattedAmount = formatCurrency(
                  tx.amount,
                  preferences.currencySymbol
                );

                return (
                  <tr key={tx.id}>
                    <td>{formatDate(tx.date, preferences.dateFormat)}</td>

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
                        <div>
                          <strong>{tx.description}</strong>
                          {tx.notes && <span className="table-note">{tx.notes}</span>}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="category-badge">{tx.category}</span>
                    </td>

                    <td>
                      <span className="payment-method-tag">{tx.paymentMethod}</span>
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

                    <td
                      className={`amount-column ${
                        isIncome ? "amount-income" : "amount-expense"
                      }`}
                    >
                      {isIncome ? `+${formattedAmount}` : `-${formattedAmount}`}
                    </td>

                    <td className="actions-column">
                      {deleteConfirmId === tx.id ? (
                        <div className="delete-confirm-group">
                          <button
                            type="button"
                            className="confirm-delete-btn"
                            onClick={() => handleDelete(tx.id)}
                            title="Confirm delete"
                          >
                            <Icon name="check" size={13} strokeWidth={2.5} />
                          </button>
                          <button
                            type="button"
                            className="cancel-delete-btn"
                            onClick={() => setDeleteConfirmId(null)}
                            title="Cancel"
                          >
                            <Icon name="close" size={13} strokeWidth={2.5} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="table-action-btn"
                          onClick={() => setDeleteConfirmId(tx.id)}
                          aria-label={`Delete transaction ${tx.description}`}
                          title="Delete transaction"
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="empty-transactions">
              <div className="empty-icon-circle">
                <Icon name="search" size={24} />
              </div>
              <strong>No transactions found</strong>
              <p>Try adjusting your search keywords or active filters.</p>
              <button
                type="button"
                className="secondary-button reset-filters-btn"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="transaction-footer">
            <span>
              Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of{" "}
              {filteredTransactions.length} transactions
            </span>

            <div className="pagination" role="navigation" aria-label="Pagination">
              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <Icon name="chevron-left" size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={safeCurrentPage === page ? "pagination-active" : ""}
                  onClick={() => setCurrentPage(page)}
                  aria-current={safeCurrentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <Icon name="chevron-right" size={14} />
              </button>
            </div>
          </div>
        )}
      </section>

      {showForm && (
        <TransactionForm onClose={() => setShowForm(false)} />
      )}
    </section>
  );
}
