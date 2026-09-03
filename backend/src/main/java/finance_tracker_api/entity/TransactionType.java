package finance_tracker_api.entity;

/**
 * Enumerates the possible types of a {@link Transaction}.
 */
public enum TransactionType {
    /** Transaction that increases the balance. */
    INCOME,
    /** Transaction that decreases the balance. */
    EXPENSE
}