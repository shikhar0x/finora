package com.expensemanager.dto;

import com.expensemanager.entity.Transaction;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public final class TransactionDtos {

    private TransactionDtos() {
    }

    public record TransactionRequest(
            @NotNull
            Long userId,

            @NotNull
            Long accountId,

            @NotNull
            Long categoryId,

            Long paymentMethodId,

            @NotNull
            Transaction.Type type,

            @NotNull
            @DecimalMin(value = "0.01")
            BigDecimal amount,

            @NotNull
            LocalDate transactionDate,

            @Size(max = 255)
            String description,

            String notes
    ) {
    }

    public record TransactionResponse(
            Long id,
            Long userId,
            Long accountId,
            Long categoryId,
            String categoryName,
            Long paymentMethodId,
            String type,
            BigDecimal amount,
            LocalDate date,
            String description,
            String notes
    ) {
    }
}
