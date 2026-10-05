package com.expensemanager.service;

import com.expensemanager.dto.GoalDtos;
import com.expensemanager.entity.Goal;
import com.expensemanager.entity.User;
import com.expensemanager.repository.GoalRepository;
import com.expensemanager.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalService(
            GoalRepository goalRepository,
            UserRepository userRepository
    ) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    public List<GoalDtos.GoalResponse> getAll(Long userId) {
        return goalRepository.findByUserIdOrderByTargetDateAsc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public GoalDtos.GoalResponse create(GoalDtos.GoalRequest request) {
        Goal goal = new Goal();
        apply(goal, request);
        goal.setUser(getUser(request.userId()));
        return toResponse(goalRepository.save(goal));
    }

    public GoalDtos.GoalResponse update(
            Long userId,
            Long id,
            GoalDtos.GoalRequest request
    ) {
        Goal goal = goalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Goal not found"
                ));

        apply(goal, request);
        return toResponse(goalRepository.save(goal));
    }

    public void delete(Long userId, Long id) {
        Goal goal = goalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Goal not found"
                ));

        goalRepository.delete(goal);
    }

    private void apply(Goal goal, GoalDtos.GoalRequest request) {
        goal.setGoalName(request.goalName().trim());
        goal.setTargetAmount(request.targetAmount());
        goal.setCurrentAmount(request.currentAmount());
        goal.setTargetDate(request.targetDate());

        try {
            goal.setStatus(Goal.Status.valueOf(request.status()));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid goal status"
            );
        }
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }

    private GoalDtos.GoalResponse toResponse(Goal goal) {
        return new GoalDtos.GoalResponse(
                goal.getId(),
                goal.getUser().getId(),
                goal.getGoalName(),
                goal.getTargetAmount(),
                goal.getCurrentAmount(),
                goal.getTargetDate(),
                goal.getStatus().name()
        );
    }
}
