package com.expensemanager.repository;

import com.expensemanager.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByTransactionDateDescIdDesc(Long userId);

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);

    @Query("""
        select coalesce(sum(t.amount), 0)
        from Transaction t
        where t.user.id = :userId
        and t.type = com.expensemanager.entity.Transaction$Type.INCOME
        """)
    BigDecimal totalIncome(Long userId);

    @Query("""
        select coalesce(sum(t.amount), 0)
        from Transaction t
        where t.user.id = :userId
        and t.type = com.expensemanager.entity.Transaction$Type.EXPENSE
        """)
    BigDecimal totalExpenses(Long userId);

    List<Transaction> findTop5ByUserIdOrderByTransactionDateDescIdDesc(Long userId);
}
