package com.expensemanager.controller;

import com.expensemanager.entity.Category;
import com.expensemanager.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Category> getCategories(
            @RequestParam(required = false) Category.Type type
    ) {
        if (type != null) {
            return categoryService.getByType(type);
        }

        return categoryService.getAll();
    }
}
