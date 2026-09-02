package finance_tracker_api.dto.dashboard;

import java.math.BigDecimal;

public record ExpenseByCategoryResponse(
        String categoryName,
        BigDecimal total
) {
}