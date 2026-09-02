package finance_tracker_api.dto.budget;

import java.math.BigDecimal;
import java.time.YearMonth;

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
