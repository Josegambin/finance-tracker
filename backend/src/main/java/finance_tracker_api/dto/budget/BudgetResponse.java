package finance_tracker_api.dto.budget;

import java.math.BigDecimal;
import java.time.YearMonth;

/**
 * Public representation of a {@code Budget} enriched with spending data.
 *
 * @param id              the budget ID
 * @param categoryId      the ID of the budgeted category
 * @param categoryName    the name of the budgeted category
 * @param month           the budget month
 * @param budgetAmount    the total budgeted amount
 * @param spentAmount     the amount spent so far in that category/month
 * @param remainingAmount the amount left to spend
 * @param percentageUsed  the percentage of the budget already used
 */
public record BudgetResponse(

                Long id,

                Long categoryId,

                String categoryName,

                YearMonth month,

                BigDecimal budgetAmount,

                BigDecimal spentAmount,

                BigDecimal remainingAmount,

                BigDecimal percentageUsed

) {
}
