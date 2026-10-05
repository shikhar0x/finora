package com.expensemanager.repository;

import com.expensemanager.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByOrderByTypeAscNameAsc();

    List<Category> findByTypeOrderByNameAsc(Category.Type type);
}
