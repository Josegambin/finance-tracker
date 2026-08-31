package finance_tracker_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import finance_tracker_api.entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository
                extends JpaRepository<Transaction, Long> {

        List<Transaction> findByUserIdOrderByDateDesc(
                        Long userId);

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
                """
        )
        BigDecimal calculateSpentAmount(
                @Param("userId")
                Long userId,

                @Param("categoryId")
                Long categoryId,

                @Param("startDate")
                LocalDate startDate,

                @Param("endDate")
                LocalDate endDate
        );
}
