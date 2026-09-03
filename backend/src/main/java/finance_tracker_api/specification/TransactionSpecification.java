package finance_tracker_api.specification;

import finance_tracker_api.entity.Transaction;
import finance_tracker_api.entity.TransactionType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.YearMonth;

/**
 * Factory of JPA {@link Specification}s used to filter transactions.
 *
 * <p>Each static method produces one predicate (user, search text, type,
 * category, month) that can be combined with {@code and()} to build
 * dynamic queries.</p>
 */
public class TransactionSpecification {

    /**
     * Private constructor: this is a stateless utility class.
     */
    private TransactionSpecification() {
    }

    /**
     * Filters transactions belonging to a user.
     *
     * @param userId the owner user ID
     * @return the user-ID predicate
     */
    public static Specification<Transaction> hasUserId(
            Long userId
    ) {

        return (
                root,
                query,
                criteriaBuilder
        ) -> criteriaBuilder.equal(
                root.get("user").get("id"),
                userId
        );
    }

    /**
     * Filters transactions whose description or category name contains the
     * search text (case-insensitive).
     *
     * @param search the text to look for
     * @return the search predicate
     */
    public static Specification<Transaction> hasSearch(
            String search
    ) {

        return (
                root,
                query,
                criteriaBuilder
        ) -> {

            String pattern =
                    "%" + search.toLowerCase() + "%";

            return criteriaBuilder.or(

                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get("description")
                            ),
                            pattern
                    ),

                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get("category")
                                            .get("name")
                            ),
                            pattern
                    )
            );
        };
    }

    /**
     * Filters transactions by their type.
     *
     * @param type the transaction type to match
     * @return the type predicate
     */
    public static Specification<Transaction> hasType(
            TransactionType type
    ) {

        return (
                root,
                query,
                criteriaBuilder
        ) -> criteriaBuilder.equal(
                root.get("type"),
                type
        );
    }

    /**
     * Filters transactions belonging to a category.
     *
     * @param categoryId the category ID to match
     * @return the category predicate
     */
    public static Specification<Transaction> hasCategoryId(
            Long categoryId
    ) {

        return (
                root,
                query,
                criteriaBuilder
        ) -> criteriaBuilder.equal(
                root.get("category").get("id"),
                categoryId
        );
    }

    /**
     * Filters transactions whose date falls within a month.
     *
     * @param month the month in the format {@code YYYY-MM}
     * @return the month predicate
     */
    public static Specification<Transaction> hasMonth(
            String month
    ) {

        YearMonth yearMonth =
                YearMonth.parse(month);

        LocalDate startDate =
                yearMonth.atDay(1);

        LocalDate endDate =
                yearMonth.atEndOfMonth();

        return (
                root,
                query,
                criteriaBuilder
        ) -> criteriaBuilder.between(
                root.get("date"),
                startDate,
                endDate
        );
    }
}