package finance_tracker_api.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import finance_tracker_api.dto.budget.BudgetResponse;
import finance_tracker_api.dto.budget.CreateBudgetRequest;
import finance_tracker_api.service.BudgetService;

import java.time.YearMonth;
import java.util.List;

/**
 * REST endpoints for managing budget resources.
 */
@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    /**
     * Creates the budget controller.
     *
     * @param budgetService budget business logic
     */
    public BudgetController(
            BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    /**
     * Creates a new budget (HTTP 201).
     *
     * @param request the budget data
     * @return the created budget
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BudgetResponse createBudget(
            @Valid @RequestBody CreateBudgetRequest request) {

        return budgetService.createBudget(
                request);
    }

    /**
     * Returns a paginated list of budgets.
     *
     * @param pageable pagination parameters (default size 20)
     * @return a page of budgets
     */
    @GetMapping
    public Page<BudgetResponse> getBudgets(
            @PageableDefault(size = 20) Pageable pageable) {

        return budgetService.getBudgets(pageable);
    }

    /**
     * Deletes a budget (HTTP 204).
     *
     * @param id the budget ID
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBudget(
            @PathVariable Long id) {

        budgetService.deleteBudget(id);
    }

    /**
     * Returns the budgets of the current user for a specific month.
     *
     * @param month the month to filter by (format {@code YYYY-MM})
     * @return the matching budgets
     */
    @GetMapping("/by-month")
    public List<BudgetResponse> getBudgetsByMonth(
            @RequestParam YearMonth month) {

        return budgetService.getBudgets(month);
    }
}