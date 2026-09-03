package finance_tracker_api.dto.transaction;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

import finance_tracker_api.entity.TransactionType;

/**
 * Request payload for creating a new transaction.
 *
 * @param description the transaction description
 * @param amount      the monetary amount (must be positive)
 * @param date        the transaction date
 * @param type        the transaction type (income or expense)
 * @param categoryId  the ID of the category to assign
 */
public record CreateTransactionRequest(

        @NotBlank
        String description,

        @NotNull
        @Positive
        BigDecimal amount,

        @NotNull
        LocalDate date,

        @NotNull
        TransactionType type,

        @NotNull
        Long categoryId

) {
}
