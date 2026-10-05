package com.expensemanager.controller;

import com.expensemanager.dto.DashboardResponse;
import com.expensemanager.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponse getDashboard(
            @RequestParam Long userId
    ) {
        return dashboardService.getDashboard(userId);
    }
}
