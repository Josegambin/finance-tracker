package finance_tracker_api.dto.budget;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.YearMonth;

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
