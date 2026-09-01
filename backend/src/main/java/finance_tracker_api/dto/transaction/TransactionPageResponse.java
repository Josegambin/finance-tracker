package finance_tracker_api.dto.transaction;

import java.util.List;

public record TransactionPageResponse(

    List<TransactionResponse> content,

    long totalElements,

    int totalPages,

    int number,

    int size

) {
}