package finance_tracker_api.dto.transaction;

import java.util.List;

/**
 * Paginated result of a transaction query.
 *
 * @param content        the transactions of the current page
 * @param totalElements  the total number of transactions
 * @param totalPages     the total number of pages
 * @param number         the current page number (zero-based)
 * @param size           the page size
 */
public record TransactionPageResponse(

    List<TransactionResponse> content,

    long totalElements,

    int totalPages,

    int number,

    int size

) {
}