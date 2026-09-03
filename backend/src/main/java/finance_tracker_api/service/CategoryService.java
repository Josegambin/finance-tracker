package finance_tracker_api.service;

import finance_tracker_api.dto.CategoryResponse;
import finance_tracker_api.dto.CreateCategoryRequest;
import finance_tracker_api.entity.Category;
import finance_tracker_api.entity.User;
import finance_tracker_api.exception.ResourceNotFoundException;
import finance_tracker_api.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Business logic for managing user categories.
 *
 * <p>All operations are scoped to the currently authenticated user, so
 * users can never read, modify or delete categories they do not own.</p>
 */
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CurrentUserService currentUserService;

    /**
     * Creates the category service.
     *
     * @param categoryRepository repository for category persistence
     * @param currentUserService resolves the authenticated user
     */
    public CategoryService(
            CategoryRepository categoryRepository,
            CurrentUserService currentUserService
    ) {
        this.categoryRepository = categoryRepository;
        this.currentUserService = currentUserService;
    }

    /**
     * Returns all categories of the current user.
     *
     * @return the user categories
     */
    public List<CategoryResponse> findAll() {

        User user =
                currentUserService.getCurrentUser();

        return categoryRepository
                .findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Returns a page of categories of the current user.
     *
     * @param pageable pagination information
     * @return a page of categories
     */
    public Page<CategoryResponse> findAllPaginated(Pageable pageable) {

        User user =
                currentUserService.getCurrentUser();

        return categoryRepository
                .findByUserId(user.getId(), pageable)
                .map(this::toResponse);
    }

    /**
     * Creates a new category owned by the current user.
     *
     * @param request the category data
     * @return the created category
     */
    public CategoryResponse create(
            CreateCategoryRequest request
    ) {

        User user =
                currentUserService.getCurrentUser();

        Category category = new Category();

        category.setName(request.name());
        category.setType(request.type());
        category.setUser(user);

        Category savedCategory =
                categoryRepository.save(category);

        return toResponse(savedCategory);
    }

    /**
     * Deletes a category of the current user.
     *
     * @param id the category ID
     * @throws ResourceNotFoundException if the category does not exist
     * @throws IllegalArgumentException  if the category belongs to another user
     */
    public void delete(Long id) {

        User user =
                currentUserService.getCurrentUser();

        Category category =
                categoryRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("Category", id)
                        );

        /*
         * IMPORTANT:
         *
         * Deleting categories that belong
         * to another user is not allowed.
         */

        if (!category.getUser()
                .getId()
                .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "You cannot delete this category"
            );
        }

        categoryRepository.delete(category);
    }

    /**
     * Maps a category entity to its public response.
     *
     * @param category the entity to map
     * @return the response DTO
     */
    private CategoryResponse toResponse(
            Category category
    ) {

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getType()
        );
    }
}