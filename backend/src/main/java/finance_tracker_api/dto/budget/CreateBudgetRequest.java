package finance_tracker_api.dto.budget;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.YearMonth;

/**
 * Request payload for creating a budget.
 *
 * @param categoryId the ID of the category to budget
 * @param month      the month the budget applies to
 * @param amount     the budgeted amount (must be positive)
 */
public record CreateBudgetRequest(

        @NotNull
        Long categoryId,

        @NotNull
        YearMonth month,

        @NotNull
        @DecimalMin("0.01")
        BigDecimal amount

) {
}
