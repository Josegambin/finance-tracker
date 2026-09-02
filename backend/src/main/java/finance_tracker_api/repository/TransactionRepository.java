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

public interface TransactionRepository
        extends JpaRepository<Transaction, Long>,
        JpaSpecificationExecutor<Transaction> {

    List<Transaction> findByUserIdOrderByDateDesc(
            Long userId);

    Page<Transaction> findByUserIdOrderByDateDesc(
            Long userId,
            Pageable pageable);

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
    List<ExpenseByCategoryResponse> findExpensesByCategory(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    List<Transaction> findByUserIdAndDateGreaterThanEqualAndDateLessThanOrderByDateDesc(
            Long userId,
            LocalDate startDate,
            LocalDate endDate);

    List<Transaction> findTop5ByUserIdAndDateGreaterThanEqualAndDateLessThanOrderByDateDesc(
            Long userId,
            LocalDate startDate,
            LocalDate endDate);
}