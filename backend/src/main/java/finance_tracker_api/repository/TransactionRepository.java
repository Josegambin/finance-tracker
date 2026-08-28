package finance_tracker_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import finance_tracker_api.entity.Transaction;
import java.util.List;

public interface TransactionRepository
                extends JpaRepository<Transaction, Long> {

        List<Transaction> findByUserIdOrderByDateDesc(
                        Long userId);

        List<Transaction> findTop5ByUserIdOrderByDateDesc(
                        Long userId);
}
