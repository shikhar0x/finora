package com.expensemanager.service;

import com.expensemanager.dto.DashboardResponse;
import com.expensemanager.entity.Transaction;
import com.expensemanager.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;

    public DashboardService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long userId) {
        BigDecimal income = transactionRepository.totalIncome(userId);
        BigDecimal expenses = transactionRepository.totalExpenses(userId);

        if (income == null) {
            income = BigDecimal.ZERO;
        }

        if (expenses == null) {
            expenses = BigDecimal.ZERO;
        }

        BigDecimal balance = income.subtract(expenses);

        List<DashboardResponse.RecentTransaction> recent =
                transactionRepository
                        .findTop5ByUserIdOrderByTransactionDateDescIdDesc(userId)
                        .stream()
                        .map(this::toRecentTransaction)
                        .toList();

        return new DashboardResponse(
                income,
                expenses,
                balance,
                recent
        );
    }

    private DashboardResponse.RecentTransaction toRecentTransaction(
            Transaction transaction
    ) {
        return new DashboardResponse.RecentTransaction(
                transaction.getId(),
                transaction.getTransactionDate(),
                transaction.getDescription(),
                transaction.getCategory().getName(),
                transaction.getType().name(),
                transaction.getAmount()
        );
    }
}
