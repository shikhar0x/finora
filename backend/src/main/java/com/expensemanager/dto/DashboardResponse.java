package com.expensemanager.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record DashboardResponse(
        BigDecimal totalIncome,
        BigDecimal totalExpenses,
        BigDecimal balance,
        List<RecentTransaction> recentTransactions
) {

    public record RecentTransaction(
            Long id,
            LocalDate date,
            String description,
            String category,
            String type,
            BigDecimal amount
    ) {
    }
}
