package com.expensemanager.repository;

import com.expensemanager.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    List<Account> findByUserIdOrderByAccountNameAsc(Long userId);

    Optional<Account> findByIdAndUserId(Long id, Long userId);
}
