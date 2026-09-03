package finance_tracker_api.controller;

import java.time.YearMonth;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import finance_tracker_api.dto.dashboard.DashboardResponse;
import finance_tracker_api.dto.dashboard.ExpenseByCategoryResponse;
import finance_tracker_api.service.DashboardService;

/**
 * REST endpoints that expose dashboard summary data.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Creates the dashboard controller.
     *
     * @param dashboardService dashboard business logic
     */
    public DashboardController(
            DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * Returns the financial summary of a month.
     *
     * @param month the month to analyze (format {@code YYYY-MM})
     * @return the dashboard summary
     */
    @GetMapping
    public DashboardResponse getDashboard(
            @RequestParam YearMonth month) {

        return dashboardService.getDashboard(month);
    }

    /**
     * Returns expense totals grouped by category for a month.
     *
     * @param month the month to analyze (format {@code YYYY-MM})
     * @return expense totals per category
     */
    @GetMapping("/expenses-by-category")
    public List<ExpenseByCategoryResponse> getExpensesByCategory(@RequestParam YearMonth month) {

        return dashboardService
                .getExpensesByCategory(month);
    }
}