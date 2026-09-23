import React, { useMemo, useState } from "react";
import TransactionForm from "../components/transactions/TransactionForm";
import SelectField from "../components/ui/SelectField";
import Icon, { getCategoryIcon } from "../components/ui/Icon";
import { useFinance } from "../context/FinanceContext";
import { formatCurrency, formatDate } from "../utils/formatters";

const ITEMS_PER_PAGE = 6;

export default function Transactions() {
  const {
    transactions,
    deleteTransaction,
    categories,
    accounts,
    paymentMethods,
    getAccountById,
    getCategoryById,
    getPaymentMethodById,
    preferences,
  } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [accountFilter, setAccountFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Filter dropdown options
  const typeFilterOptions = [
    { value: "ALL", label: "All Types" },
    { value: "INCOME", label: "Income Only" },
    { value: "EXPENSE", label: "Expense Only" },
  ];

  const accountFilterOptions = useMemo(() => {
    return [
      { value: "ALL", label: "All Accounts" },
      ...accounts.map((a) => ({ value: String(a.id), label: a.accountName })),
    ];
  }, [accounts]);

  const categoryFilterOptions = useMemo(() => {
    return [
      { value: "ALL", label: "All Categories" },
      ...categories.map((c) => ({ value: String(c.id), label: c.name })),
    ];
  }, [categories]);

  const paymentFilterOptions = useMemo(() => {
    return [
      { value: "ALL", label: "All Payment Methods" },
      ...paymentMethods.map((p) => ({
        value: String(p.id),
        label: p.methodName,
      })),
    ];
  }, [paymentMethods]);

  // Filtering
  const filteredTransactions = useMemo(() => {
    const query = search.toLowerCase().trim();

    return transactions.filter((tx) => {
      const cat = getCategoryById(tx.categoryId);
      const acc = getAccountById(tx.accountId);
      const pm = getPaymentMethodById(tx.paymentMethodId);

      const categoryName = cat ? cat.name.toLowerCase() : "";
      const accountName = acc ? acc.accountName.toLowerCase() : "";
      const paymentName = pm ? pm.methodName.toLowerCase() : "";
      const desc = (tx.description || "").toLowerCase();
      const notes = (tx.notes || "").toLowerCase();

      const matchesSearch =
        !query ||
        desc.includes(query) ||
        categoryName.includes(query) ||
        accountName.includes(query) ||
        paymentName.includes(query) ||
        notes.includes(query);

      const matchesType = typeFilter === "ALL" || tx.type === typeFilter;
      const matchesAccount =
        accountFilter === "ALL" || String(tx.accountId) === accountFilter;
      const matchesCategory =
        categoryFilter === "ALL" || String(tx.categoryId) === categoryFilter;
      const matchesPayment =
        paymentFilter === "ALL" || String(tx.paymentMethodId) === paymentFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesAccount &&
        matchesCategory &&
        matchesPayment
      );
    });
  }, [
    transactions,
    search,
    typeFilter,
    accountFilter,
    categoryFilter,
    paymentFilter,
    getCategoryById,
    getAccountById,
    getPaymentMethodById,
  ]);

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

  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setAccountFilter("ALL");
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
              placeholder="Search description, category, account..."
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
              onChange={(val) => {
                setTypeFilter(val);
                setCurrentPage(1);
              }}
              options={typeFilterOptions}
              className="toolbar-select"
            />

            <SelectField
              value={accountFilter}
              onChange={(val) => {
                setAccountFilter(val);
                setCurrentPage(1);
              }}
              options={accountFilterOptions}
              className="toolbar-select"
            />

            <SelectField
              value={categoryFilter}
              onChange={(val) => {
                setCategoryFilter(val);
                setCurrentPage(1);
              }}
              options={categoryFilterOptions}
              className="toolbar-select"
            />

            <SelectField
              value={paymentFilter}
              onChange={(val) => {
                setPaymentFilter(val);
                setCurrentPage(1);
              }}
              options={paymentFilterOptions}
              className="toolbar-select"
            />
          </div>
        </div>

        {/* Table */}
        <div className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Account</th>
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
                const cat = getCategoryById(tx.categoryId);
                const acc = getAccountById(tx.accountId);
                const pm = getPaymentMethodById(tx.paymentMethodId);

                const categoryName = cat ? cat.name : `Category ${tx.categoryId}`;
                const accountName = acc ? acc.accountName : `Account ${tx.accountId}`;
                const paymentName = pm ? pm.methodName : "—";

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
                          <strong>{tx.description || "Untitled Transaction"}</strong>
                          {tx.notes && <span className="table-note">{tx.notes}</span>}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="account-tag">
                        <Icon name="bank" size={13} />
                        {accountName}
                      </span>
                    </td>

                    <td>
                      <span className="category-badge">
                        <Icon name={getCategoryIcon(categoryName)} size={12} strokeWidth={2} />
                        {categoryName}
                      </span>
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

      {showForm && <TransactionForm onClose={() => setShowForm(false)} />}
    </section>
  );
}
