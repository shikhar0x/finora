package com.expensemanager.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public final class BudgetDtos {

    private BudgetDtos() {
    }

    public record BudgetRequest(
            @NotNull
            Long userId,

            @NotNull
            Long categoryId,

            @NotNull
            @DecimalMin(value = "0.01")
            BigDecimal amount,

            @NotNull
            @Min(1)
            @Max(12)
            Integer month,

            @NotNull
            @Min(2000)
            Integer year
    ) {
    }

    public record BudgetResponse(
            Long id,
            Long userId,
            Long categoryId,
            String categoryName,
            BigDecimal amount,
            Integer month,
            Integer year
    ) {
    }
}
