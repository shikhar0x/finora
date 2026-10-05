package com.expensemanager.controller;

import com.expensemanager.dto.AccountDtos;
import com.expensemanager.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:5173")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public List<AccountDtos.AccountResponse> getAccounts(
            @RequestParam Long userId
    ) {
        return accountService.getByUser(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountDtos.AccountResponse createAccount(
            @Valid @RequestBody AccountDtos.AccountRequest request
    ) {
        return accountService.create(request);
    }
}
