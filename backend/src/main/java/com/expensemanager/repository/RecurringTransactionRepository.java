package com.expensemanager.repository;

import com.expensemanager.entity.RecurringTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecurringTransactionRepository
        extends JpaRepository<RecurringTransaction, Long> {

    List<RecurringTransaction> findByUserIdOrderByStartDateDesc(Long userId);

    Optional<RecurringTransaction> findByIdAndUserId(Long id, Long userId);
}
