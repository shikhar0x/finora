package com.expensemanager.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public final class GoalDtos {

    private GoalDtos() {
    }

    public record GoalRequest(
            @NotNull Long userId,

            @NotBlank
            @Size(max = 150)
            String goalName,

            @NotNull
            @DecimalMin(value = "0.01")
            BigDecimal targetAmount,

            @NotNull
            @DecimalMin(value = "0.00")
            BigDecimal currentAmount,

            LocalDate targetDate,

            @NotNull
            String status
    ) {
    }

    public record GoalResponse(
            Long id,
            Long userId,
            String goalName,
            BigDecimal targetAmount,
            BigDecimal currentAmount,
            LocalDate targetDate,
            String status
    ) {
    }
}
