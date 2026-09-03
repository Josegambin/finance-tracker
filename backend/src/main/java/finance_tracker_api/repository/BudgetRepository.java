package finance_tracker_api.repository;

import finance_tracker_api.entity.Budget;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository
        extends JpaRepository<Budget, Long> {

    Page<Budget> findByUserId(Long userId, Pageable pageable);

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