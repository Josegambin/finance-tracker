package finance_tracker_api.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import finance_tracker_api.dto.dashboard.ExpenseByCategoryResponse;
import finance_tracker_api.entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Spring Data repository for {@link Transaction} entities.
 *
 * <p>Combines a JPA repository with a {@link JpaSpecificationExecutor} so
 * that dynamic filtering via {@code Specification}s is supported.</p>
 */
public interface TransactionRepository
        extends JpaRepository<Transaction, Long>,
        JpaSpecificationExecutor<Transaction> {

    /**
     * Returns all transactions of a user, newest first.
     *
     * @param userId the owner user ID
     * @return the user transactions
     */
    List<Transaction> findByUserIdOrderByDateDesc(
            Long userId);

    /**
     * Returns a page of transactions of a user, newest first.
     *
     * @param userId   the owner user ID
     * @param pageable pagination information
     * @return a page of transactions
     */
    Page<Transaction> findByUserIdOrderByDateDesc(
            Long userId,
            Pageable pageable);

    /**
     * Returns the five most recent transactions of a user.
     *
     * @param userId the owner user ID
     * @return up to five transactions, newest first
     */
    List<Transaction> findTop5ByUserIdOrderByDateDesc(
            Long userId);

    @Query("""
            SELECT COALESCE(
            SUM(t.amount),
            0
            )
            FROM Transaction t
            WHERE t.user.id = :userId
            AND t.category.id = :categoryId
            AND t.type = 'EXPENSE'
            AND t.date BETWEEN :startDate AND :endDate
            """)
    /**
     * Calculates the total amount spent on a category between two dates.
     *
     * <p>Only transactions of type {@code EXPENSE} for the given user and
     * category are summed. Returns {@code 0} when nothing is found.</p>
     *
     * @param userId     the owner user ID
     * @param categoryId the category ID to filter by
     * @param startDate  inclusive start of the range
     * @param endDate    inclusive end of the range
     * @return the spent amount (never {@code null})
     */
    BigDecimal calculateSpentAmount(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("""
                SELECT new finance_tracker_api.dto.dashboard.ExpenseByCategoryResponse(
                    c.name,
                    SUM(t.amount)
                )
                FROM Transaction t
                JOIN t.category c
                WHERE t.user.id = :userId
                  AND t.type = finance_tracker_api.entity.TransactionType.EXPENSE
                  AND t.date >= :startDate
                  AND t.date < :endDate
                GROUP BY c.name
                ORDER BY SUM(t.amount) DESC
            """)
    /**
     * Aggregates expenses grouped by category name within a date range.
     *
     * @param userId    the owner user ID
     * @param startDate inclusive start of the range
     * @param endDate   exclusive end of the range
     * @return expense totals per category, ordered by amount descending
     */
    List<ExpenseByCategoryResponse> findExpensesByCategory(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Returns the transactions of a user within a half-open date range
     * {@code [startDate, endDate)}, ordered by date descending.
     *
     * @param userId    the owner user ID
     * @param startDate inclusive start of the range
     * @param endDate   exclusive end of the range
     * @return matching transactions, newest first
     */
    List<Transaction> findByUserIdAndDateGreaterThanEqualAndDateLessThanOrderByDateDesc(
            Long userId,
            LocalDate startDate,
            LocalDate endDate);

    /**
     * Returns up to five transactions of a user within a half-open date
     * range {@code [startDate, endDate)}, ordered by date descending.
     *
     * @param userId    the owner user ID
     * @param startDate inclusive start of the range
     * @param endDate   exclusive end of the range
     * @return up to five matching transactions, newest first
     */
    List<Transaction> findTop5ByUserIdAndDateGreaterThanEqualAndDateLessThanOrderByDateDesc(
            Long userId,
            LocalDate startDate,
            LocalDate endDate);
}