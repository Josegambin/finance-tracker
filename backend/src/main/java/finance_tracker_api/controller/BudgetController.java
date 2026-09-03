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

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(
            BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BudgetResponse createBudget(
            @Valid @RequestBody CreateBudgetRequest request) {

        return budgetService.createBudget(
                request);
    }

    @GetMapping
    public Page<BudgetResponse> getBudgets(
            @PageableDefault(size = 20) Pageable pageable) {

        return budgetService.getBudgets(pageable);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBudget(
            @PathVariable Long id) {

        budgetService.deleteBudget(id);
    }

    @GetMapping("/by-month")
    public List<BudgetResponse> getBudgetsByMonth(
            @RequestParam YearMonth month) {

        return budgetService.getBudgets(month);
    }
}