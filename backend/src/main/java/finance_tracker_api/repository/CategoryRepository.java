package finance_tracker_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import finance_tracker_api.entity.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository
        extends JpaRepository<Category, Long> {

    List<Category> findByUserId(
     Long userId
    );

    Optional<Category> findByIdAndUserId(
        Long id,
        Long userId
);
}