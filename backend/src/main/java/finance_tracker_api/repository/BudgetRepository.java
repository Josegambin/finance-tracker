package finance_tracker_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import finance_tracker_api.entity.Budget;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository
        extends JpaRepository<Budget, Long> {

    List<Budget> findByUserIdOrderByMonthDesc(
            Long userId
    );

    List<Budget> findByUserIdAndMonthOrderByCategoryNameAsc(
            Long userId,
            YearMonth month
    );

    Optional<Budget>
    findByUserIdAndCategoryIdAndMonth(
            Long userId,
            Long categoryId,
            YearMonth month
    );
}