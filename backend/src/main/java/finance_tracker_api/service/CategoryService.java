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

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CurrentUserService currentUserService;

    public CategoryService(
            CategoryRepository categoryRepository,
            CurrentUserService currentUserService
    ) {
        this.categoryRepository = categoryRepository;
        this.currentUserService = currentUserService;
    }

    public List<CategoryResponse> findAll() {

        User user =
                currentUserService.getCurrentUser();

        return categoryRepository
                .findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Page<CategoryResponse> findAllPaginated(Pageable pageable) {

        User user =
                currentUserService.getCurrentUser();

        return categoryRepository
                .findByUserId(user.getId(), pageable)
                .map(this::toResponse);
    }

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
         * IMPORTANTE:
         *
         * No permitimos borrar categorías
         * de otro usuario.
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