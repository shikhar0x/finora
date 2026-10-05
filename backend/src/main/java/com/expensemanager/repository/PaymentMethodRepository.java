package com.expensemanager.repository;

import com.expensemanager.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {

    List<PaymentMethod> findByUserIdOrderByMethodNameAsc(Long userId);

    Optional<PaymentMethod> findByIdAndUserId(Long id, Long userId);
}
