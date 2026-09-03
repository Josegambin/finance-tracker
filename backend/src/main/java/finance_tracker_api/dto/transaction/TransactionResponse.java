package finance_tracker_api.dto.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

import finance_tracker_api.entity.TransactionType;

/**
 * Public representation of a {@code Transaction}.
 *
 * @param id           the transaction ID
 * @param description  the transaction description
 * @param amount       the monetary amount
 * @param date         the transaction date
 * @param type         the transaction type (income or expense)
 * @param categoryId   the ID of the assigned category
 * @param categoryName the name of the assigned category
 */
public record TransactionResponse(

        Long id,

        String description,

        BigDecimal amount,

        LocalDate date,

        TransactionType type,

        Long categoryId,

        String categoryName

) {
}
