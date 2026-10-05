package com.expensemanager.service;

import com.expensemanager.entity.Category;
import com.expensemanager.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAll() {
        return categoryRepository.findAllByOrderByTypeAscNameAsc();
    }

    public List<Category> getByType(Category.Type type) {
        return categoryRepository.findByTypeOrderByNameAsc(type);
    }
}
