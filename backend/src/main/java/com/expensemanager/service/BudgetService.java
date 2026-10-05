package com.expensemanager.service;

import com.expensemanager.dto.BudgetDtos;
import com.expensemanager.entity.Budget;
import com.expensemanager.entity.Category;
import com.expensemanager.entity.User;
import com.expensemanager.repository.BudgetRepository;
import com.expensemanager.repository.CategoryRepository;
import com.expensemanager.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository
    ) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<BudgetDtos.BudgetResponse> getAll(Long userId) {
        return budgetRepository
                .findByUserIdOrderByYearDescMonthDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public BudgetDtos.BudgetResponse create(
            BudgetDtos.BudgetRequest request
    ) {
        User user = getUser(request.userId());
        Category category = getCategory(request.categoryId());

        if (category.getType() != Category.Type.EXPENSE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Budgets can only be created for expense categories"
            );
        }

        if (budgetRepository
                .findByUserIdAndCategoryIdAndMonthAndYear(
                        request.userId(),
                        request.categoryId(),
                        request.month(),
                        request.year()
                )
                .isPresent()) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A budget already exists for this category and period"
            );
        }

        Budget budget = new Budget();
        budget.setUser(user);
        budget.setCategory(category);
        budget.setAmount(request.amount());
        budget.setMonth(request.month());
        budget.setYear(request.year());

        return toResponse(budgetRepository.save(budget));
    }

    public BudgetDtos.BudgetResponse update(
            Long userId,
            Long id,
            BudgetDtos.BudgetRequest request
    ) {
        Budget budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Budget not found"
                ));

        Category category = getCategory(request.categoryId());

        if (category.getType() != Category.Type.EXPENSE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Budgets can only use expense categories"
            );
        }

        budget.setCategory(category);
        budget.setAmount(request.amount());
        budget.setMonth(request.month());
        budget.setYear(request.year());

        return toResponse(budgetRepository.save(budget));
    }

    public void delete(Long userId, Long id) {
        Budget budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Budget not found"
                ));

        budgetRepository.delete(budget);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }

    private Category getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));
    }

    private BudgetDtos.BudgetResponse toResponse(Budget budget) {
        return new BudgetDtos.BudgetResponse(
                budget.getId(),
                budget.getUser().getId(),
                budget.getCategory().getId(),
                budget.getCategory().getName(),
                budget.getAmount(),
                budget.getMonth(),
                budget.getYear()
        );
    }
}
