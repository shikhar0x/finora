package com.expensemanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public final class PaymentMethodDtos {

    private PaymentMethodDtos() {
    }

    public record PaymentMethodRequest(
            @NotNull
            Long userId,

            @NotBlank
            @Size(max = 100)
            String methodName,

            @Size(max = 255)
            String details
    ) {
    }

    public record PaymentMethodResponse(
            Long id,
            Long userId,
            String methodName,
            String details,
            LocalDateTime createdAt
    ) {
    }
}
