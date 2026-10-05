package com.expensemanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record RegisterRequest(
            @NotBlank
            @Size(max = 100)
            String name,

            @NotBlank
            @Email
            String email,

            @NotBlank
            @Size(min = 6, max = 100)
            String password
    ) {
    }

    public record LoginRequest(
            @NotBlank
            @Email
            String email,

            @NotBlank
            String password
    ) {
    }

    public record AuthResponse(
            Long userId,
            String name,
            String email
    ) {
    }
}
