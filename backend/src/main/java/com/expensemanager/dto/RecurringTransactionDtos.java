package com.expensemanager.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public final class RecurringTransactionDtos {

    private RecurringTransactionDtos() {
    }

    public record RecurringTransactionRequest(
            @NotNull Long userId,
            @NotNull Long accountId,
            @NotNull Long categoryId,
            Long paymentMethodId,
            @NotNull String type,
            @NotNull
            @DecimalMin(value = "0.01")
            BigDecimal amount,
            @NotNull String frequency,
            @NotNull LocalDate startDate,
            LocalDate endDate,
            String description,
            @NotNull Boolean isActive
    ) {
    }

    public record RecurringTransactionResponse(
            Long id,
            Long userId,
            Long accountId,
            Long categoryId,
            Long paymentMethodId,
            String type,
            BigDecimal amount,
            String frequency,
            LocalDate startDate,
            LocalDate endDate,
            String description,
            Boolean isActive
    ) {
    }
}
