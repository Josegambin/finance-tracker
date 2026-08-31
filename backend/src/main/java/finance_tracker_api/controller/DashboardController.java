package finance_tracker_api.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import finance_tracker_api.dto.dashboard.DashboardResponse;
import finance_tracker_api.dto.dashboard.ExpenseByCategoryResponse;
import finance_tracker_api.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponse getDashboard() {

        return dashboardService.getDashboard();
    }

    @GetMapping("/expenses-by-category")
    public List<ExpenseByCategoryResponse> getExpensesByCategory() {

        return dashboardService
                .getExpensesByCategory();
    }
}