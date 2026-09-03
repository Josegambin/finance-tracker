package finance_tracker_api.repository;

import finance_tracker_api.entity.Budget;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data repository for {@link Budget} entities.
 */
public interface BudgetRepository
        extends JpaRepository<Budget, Long> {

    /**
     * Returns a page of budgets owned by the given user.
     *
     * @param userId   the owner user ID
     * @param pageable pagination information
     * @return a page of budgets
     */
    Page<Budget> findByUserId(Long userId, Pageable pageable);

    /**
     * Returns all budgets of a user, most recent month first.
     *
     * @param userId the owner user ID
     * @return the user budgets
     */
    List<Budget> findByUserIdOrderByMonthDesc(
            Long userId
    );

    /**
     * Returns the budgets of a user for a specific month, ordered by
     * category name ascending.
     *
     * @param userId the owner user ID
     * @param month  the month to filter by
     * @return matching budgets
     */
    List<Budget> findByUserIdAndMonthOrderByCategoryNameAsc(
            Long userId,
            YearMonth month
    );

    /**
     * Finds the budget that uniquely identifies a user, category and month.
     *
     * @param userId     the owner user ID
     * @param categoryId the category ID
     * @param month      the budget month
     * @return the matching budget, if any
     */
    Optional<Budget>
    findByUserIdAndCategoryIdAndMonth(
            Long userId,
            Long categoryId,
            YearMonth month
    );
}