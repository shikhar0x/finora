package com.expensemanager.controller;

import com.expensemanager.dto.RecurringTransactionDtos;
import com.expensemanager.service.RecurringTransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recurring-transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class RecurringTransactionController {

    private final RecurringTransactionService service;

    public RecurringTransactionController(
            RecurringTransactionService service
    ) {
        this.service = service;
    }

    @GetMapping
    public List<RecurringTransactionDtos.RecurringTransactionResponse> getAll(
            @RequestParam Long userId
    ) {
        return service.getAll(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecurringTransactionDtos.RecurringTransactionResponse create(
            @Valid @RequestBody
            RecurringTransactionDtos.RecurringTransactionRequest request
    ) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public RecurringTransactionDtos.RecurringTransactionResponse update(
            @PathVariable Long id,
            @Valid @RequestBody
            RecurringTransactionDtos.RecurringTransactionRequest request
    ) {
        return service.update(request.userId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @RequestParam Long userId,
            @PathVariable Long id
    ) {
        service.delete(userId, id);
    }

    @PatchMapping("/{id}/toggle")
    public RecurringTransactionDtos.RecurringTransactionResponse toggle(
            @RequestParam Long userId,
            @PathVariable Long id
    ) {
        return service.toggle(userId, id);
    }
}
