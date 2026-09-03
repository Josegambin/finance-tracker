package finance_tracker_api.dto.dashboard;

import java.math.BigDecimal;

/**
 * Aggregated expense total for a single category.
 *
 * @param categoryName the name of the category
 * @param total        the total amount spent in that category
 */
public record ExpenseByCategoryResponse(
        String categoryName,
        BigDecimal total
) {
}