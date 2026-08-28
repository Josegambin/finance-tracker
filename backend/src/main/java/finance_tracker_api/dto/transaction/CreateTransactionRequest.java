package finance_tracker_api.dto.transaction;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

import finance_tracker_api.entity.TransactionType;

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
