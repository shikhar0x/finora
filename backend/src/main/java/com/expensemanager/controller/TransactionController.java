package com.expensemanager.controller;

import com.expensemanager.dto.TransactionDtos;
import com.expensemanager.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public List<TransactionDtos.TransactionResponse> getTransactions(
            @RequestParam Long userId
    ) {
        return transactionService.getAll(userId);
    }

    @GetMapping("/{id}")
    public TransactionDtos.TransactionResponse getTransaction(
            @RequestParam Long userId,
            @PathVariable Long id
    ) {
        return transactionService.getById(userId, id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionDtos.TransactionResponse createTransaction(
            @Valid @RequestBody TransactionDtos.TransactionRequest request
    ) {
        return transactionService.create(request);
    }

    @PutMapping("/{id}")
    public TransactionDtos.TransactionResponse updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionDtos.TransactionRequest request
    ) {
        return transactionService.update(
                request.userId(),
                id,
                request
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTransaction(
            @RequestParam Long userId,
            @PathVariable Long id
    ) {
        transactionService.delete(userId, id);
    }
}
