package com.expensemanager.service;

import com.expensemanager.dto.RecurringTransactionDtos;
import com.expensemanager.entity.*;
import com.expensemanager.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RecurringTransactionService {

    private final RecurringTransactionRepository repository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;

    public RecurringTransactionService(
            RecurringTransactionRepository repository,
            UserRepository userRepository,
            AccountRepository accountRepository,
            CategoryRepository categoryRepository
    ) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<RecurringTransactionDtos.RecurringTransactionResponse> getAll(
            Long userId
    ) {
        return repository.findByUserIdOrderByStartDateDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public RecurringTransactionDtos.RecurringTransactionResponse create(
            RecurringTransactionDtos.RecurringTransactionRequest request
    ) {
        RecurringTransaction recurring = new RecurringTransaction();
        recurring.setUser(getUser(request.userId()));
        apply(recurring, request);
        return toResponse(repository.save(recurring));
    }

    public RecurringTransactionDtos.RecurringTransactionResponse update(
            Long userId,
            Long id,
            RecurringTransactionDtos.RecurringTransactionRequest request
    ) {
        RecurringTransaction recurring =
                repository.findByIdAndUserId(id, userId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Recurring transaction not found"
                        ));

        apply(recurring, request);
        return toResponse(repository.save(recurring));
    }

    public void delete(Long userId, Long id) {
        RecurringTransaction recurring =
                repository.findByIdAndUserId(id, userId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Recurring transaction not found"
                        ));

        repository.delete(recurring);
    }

    public RecurringTransactionDtos.RecurringTransactionResponse toggle(
            Long userId,
            Long id
    ) {
        RecurringTransaction recurring =
                repository.findByIdAndUserId(id, userId)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Recurring transaction not found"
                        ));

        recurring.setIsActive(!Boolean.TRUE.equals(recurring.getIsActive()));

        return toResponse(repository.save(recurring));
    }

    private void apply(
            RecurringTransaction recurring,
            RecurringTransactionDtos.RecurringTransactionRequest request
    ) {
        Account account = accountRepository
                .findByIdAndUserId(request.accountId(), request.userId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Account not found"
                ));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        recurring.setAccount(account);
        recurring.setCategory(category);
        recurring.setPaymentMethodId(request.paymentMethodId());

        try {
            recurring.setType(
                    RecurringTransaction.Type.valueOf(request.type())
            );

            recurring.setFrequency(
                    RecurringTransaction.Frequency.valueOf(request.frequency())
            );
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid recurring transaction type or frequency"
            );
        }

        recurring.setAmount(request.amount());
        recurring.setStartDate(request.startDate());
        recurring.setEndDate(request.endDate());
        recurring.setDescription(
                request.description() == null
                        ? null
                        : request.description().trim()
        );
        recurring.setIsActive(request.isActive());
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }

    private RecurringTransactionDtos.RecurringTransactionResponse toResponse(
            RecurringTransaction recurring
    ) {
        return new RecurringTransactionDtos.RecurringTransactionResponse(
                recurring.getId(),
                recurring.getUser().getId(),
                recurring.getAccount().getId(),
                recurring.getCategory().getId(),
                recurring.getPaymentMethodId(),
                recurring.getType().name(),
                recurring.getAmount(),
                recurring.getFrequency().name(),
                recurring.getStartDate(),
                recurring.getEndDate(),
                recurring.getDescription(),
                recurring.getIsActive()
        );
    }
}
