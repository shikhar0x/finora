package com.expensemanager.service;

import com.expensemanager.dto.TransactionDtos;
import com.expensemanager.entity.Account;
import com.expensemanager.entity.Category;
import com.expensemanager.entity.Transaction;
import com.expensemanager.entity.User;
import com.expensemanager.repository.AccountRepository;
import com.expensemanager.repository.CategoryRepository;
import com.expensemanager.repository.TransactionRepository;
import com.expensemanager.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            AccountRepository accountRepository,
            CategoryRepository categoryRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<TransactionDtos.TransactionResponse> getAll(Long userId) {
        return transactionRepository
                .findByUserIdOrderByTransactionDateDescIdDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TransactionDtos.TransactionResponse getById(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Transaction not found"
                        )
                );

        return toResponse(transaction);
    }

    @Transactional
    public TransactionDtos.TransactionResponse create(
            TransactionDtos.TransactionRequest request
    ) {
        User user = getUser(request.userId());

        Account account = getAccount(request.accountId(), request.userId());

        Category category = getCategory(request.categoryId());

        validateCategoryType(request.type(), category);

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAccount(account);
        transaction.setCategory(category);
        transaction.setType(request.type());
        transaction.setAmount(request.amount());
        transaction.setTransactionDate(request.transactionDate());
        transaction.setDescription(request.description());
        transaction.setNotes(request.notes());

        applyBalanceChange(
                account,
                request.type(),
                request.amount()
        );

        Transaction saved = transactionRepository.save(transaction);

        return toResponse(saved);
    }

    @Transactional
    public TransactionDtos.TransactionResponse update(
            Long userId,
            Long transactionId,
            TransactionDtos.TransactionRequest request
    ) {
        Transaction transaction = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Transaction not found"
                        )
                );

        /*
         * First reverse the effect of the existing transaction
         * from its original account.
         */
        reverseBalanceChange(
                transaction.getAccount(),
                transaction.getType(),
                transaction.getAmount()
        );

        Account account = getAccount(
                request.accountId(),
                userId
        );

        Category category = getCategory(
                request.categoryId()
        );

        validateCategoryType(
                request.type(),
                category
        );

        transaction.setAccount(account);
        transaction.setCategory(category);
        transaction.setType(request.type());
        transaction.setAmount(request.amount());
        transaction.setTransactionDate(request.transactionDate());
        transaction.setDescription(request.description());
        transaction.setNotes(request.notes());

        /*
         * Apply the new transaction effect to the
         * selected account.
         */
        applyBalanceChange(
                account,
                request.type(),
                request.amount()
        );

        Transaction saved = transactionRepository.save(transaction);

        return toResponse(saved);
    }

    @Transactional
    public void delete(
            Long userId,
            Long transactionId
    ) {
        Transaction transaction = transactionRepository
                .findByIdAndUserId(transactionId, userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Transaction not found"
                        )
                );

        /*
         * Remove the transaction's effect from the
         * account balance before deleting it.
         */
        reverseBalanceChange(
                transaction.getAccount(),
                transaction.getType(),
                transaction.getAmount()
        );

        transactionRepository.delete(transaction);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );
    }

    private Account getAccount(
            Long accountId,
            Long userId
    ) {
        return accountRepository.findById(accountId)
                .filter(account ->
                        account.getUser().getId().equals(userId)
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Account not found"
                        )
                );
    }

    private Category getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Category not found"
                        )
                );
    }

    private void validateCategoryType(
            Transaction.Type transactionType,
            Category category
    ) {
        Category.Type expectedType =
                transactionType == Transaction.Type.INCOME
                        ? Category.Type.INCOME
                        : Category.Type.EXPENSE;

        if (category.getType() != expectedType) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Category type does not match transaction type"
            );
        }
    }

    private void applyBalanceChange(
            Account account,
            Transaction.Type type,
            BigDecimal amount
    ) {
        BigDecimal currentBalance =
                account.getCurrentBalance() == null
                        ? BigDecimal.ZERO
                        : account.getCurrentBalance();

        if (type == Transaction.Type.INCOME) {
            account.setCurrentBalance(
                    currentBalance.add(amount)
            );
        } else {
            account.setCurrentBalance(
                    currentBalance.subtract(amount)
            );
        }

        accountRepository.save(account);
    }

    private void reverseBalanceChange(
            Account account,
            Transaction.Type type,
            BigDecimal amount
    ) {
        BigDecimal currentBalance =
                account.getCurrentBalance() == null
                        ? BigDecimal.ZERO
                        : account.getCurrentBalance();

        if (type == Transaction.Type.INCOME) {
            account.setCurrentBalance(
                    currentBalance.subtract(amount)
            );
        } else {
            account.setCurrentBalance(
                    currentBalance.add(amount)
            );
        }

        accountRepository.save(account);
    }

    private TransactionDtos.TransactionResponse toResponse(
            Transaction transaction
    ) {
        return new TransactionDtos.TransactionResponse(
                transaction.getId(),
                transaction.getUser().getId(),
                transaction.getAccount().getId(),
                transaction.getCategory().getId(),
                transaction.getCategory().getName(),
                transaction.getType().name(),
                transaction.getAmount(),
                transaction.getTransactionDate(),
                transaction.getDescription(),
                transaction.getNotes()
        );
    }
}
