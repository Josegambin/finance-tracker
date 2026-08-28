package finance_tracker_api.dto.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

import finance_tracker_api.entity.TransactionType;

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
