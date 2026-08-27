package finance_tracker_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import finance_tracker_api.entity.Category;

import java.util.List;

public interface CategoryRepository
        extends JpaRepository<Category, Long> {

    List<Category> findByUserId(Long userId);

}