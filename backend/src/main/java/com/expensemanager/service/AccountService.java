package com.expensemanager.service;

import com.expensemanager.dto.AccountDtos;
import com.expensemanager.entity.Account;
import com.expensemanager.entity.User;
import com.expensemanager.repository.AccountRepository;
import com.expensemanager.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountService(
            AccountRepository accountRepository,
            UserRepository userRepository
    ) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    public List<AccountDtos.AccountResponse> getByUser(Long userId) {
        return accountRepository
                .findByUserIdOrderByAccountNameAsc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AccountDtos.AccountResponse create(
            AccountDtos.AccountRequest request
    ) {
        User user = getUser(request.userId());

        Account account = new Account(
                user,
                request.accountName().trim(),
                request.accountType(),
                request.currentBalance(),
                request.currency().trim().toUpperCase()
        );

        return toResponse(accountRepository.save(account));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }

    private AccountDtos.AccountResponse toResponse(Account account) {
        return new AccountDtos.AccountResponse(
                account.getId(),
                account.getUser().getId(),
                account.getAccountName(),
                account.getAccountType().name(),
                account.getCurrentBalance(),
                account.getCurrency()
        );
    }
}
