package finance_tracker_api.repository;

import finance_tracker_api.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data repository for {@link Category} entities.
 */
public interface CategoryRepository
        extends JpaRepository<Category, Long> {

    /**
     * Returns all categories owned by the given user, unsorted.
     *
     * @param userId the owner user ID
     * @return the categories of the user
     */
    List<Category> findByUserId(
     Long userId
    );

    /**
     * Returns a page of categories owned by the given user.
     *
     * @param userId   the owner user ID
     * @param pageable pagination and sorting information
     * @return a page of categories
     */
    Page<Category> findByUserId(Long userId, Pageable pageable);

    /**
     * Finds a category by its ID, scoped to a specific owner. Used to
     * prevent users from accessing categories they do not own.
     *
     * @param id     the category ID
     * @param userId the owner user ID
     * @return the matching category, if it belongs to the user
     */
    Optional<Category> findByIdAndUserId(
        Long id,
        Long userId
);
}