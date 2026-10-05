package com.expensemanager.controller;

import com.expensemanager.dto.GoalDtos;
import com.expensemanager.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:5173")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public List<GoalDtos.GoalResponse> getGoals(
            @RequestParam Long userId
    ) {
        return goalService.getAll(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GoalDtos.GoalResponse createGoal(
            @Valid @RequestBody GoalDtos.GoalRequest request
    ) {
        return goalService.create(request);
    }

    @PutMapping("/{id}")
    public GoalDtos.GoalResponse updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody GoalDtos.GoalRequest request
    ) {
        return goalService.update(request.userId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGoal(
            @RequestParam Long userId,
            @PathVariable Long id
    ) {
        goalService.delete(userId, id);
    }
}
