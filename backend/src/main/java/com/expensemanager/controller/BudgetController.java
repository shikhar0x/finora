package com.expensemanager.controller;

import com.expensemanager.dto.BudgetDtos;
import com.expensemanager.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:5173")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public List<BudgetDtos.BudgetResponse> getBudgets(
            @RequestParam Long userId
    ) {
        return budgetService.getAll(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BudgetDtos.BudgetResponse createBudget(
            @Valid @RequestBody BudgetDtos.BudgetRequest request
    ) {
        return budgetService.create(request);
    }

    @PutMapping("/{id}")
    public BudgetDtos.BudgetResponse updateBudget(
            @PathVariable Long id,
            @Valid @RequestBody BudgetDtos.BudgetRequest request
    ) {
        return budgetService.update(
                request.userId(),
                id,
                request
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBudget(
            @RequestParam Long userId,
            @PathVariable Long id
    ) {
        budgetService.delete(userId, id);
    }
}
