package com.expensemanager.dto;

import com.expensemanager.entity.Account;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public final class AccountDtos {

    private AccountDtos() {
    }

    public record AccountRequest(
            @NotNull
            Long userId,

            @NotBlank
            @Size(max = 100)
            String accountName,

            @NotNull
            Account.Type accountType,

            @NotNull
            BigDecimal currentBalance,

            @NotBlank
            @Size(min = 3, max = 3)
            String currency
    ) {
    }

    public record AccountResponse(
            Long id,
            Long userId,
            String accountName,
            String accountType,
            BigDecimal currentBalance,
            String currency
    ) {
    }
}
