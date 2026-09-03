package finance_tracker_api.controller;

import finance_tracker_api.dto.CategoryResponse;
import finance_tracker_api.dto.CreateCategoryRequest;
import finance_tracker_api.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for managing category resources.
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Creates the category controller.
     *
     * @param categoryService category business logic
     */
    public CategoryController(
            CategoryService categoryService
    ) {
        this.categoryService = categoryService;
    }

    /**
     * Returns all categories of the current user.
     *
     * @return the user categories
     */
    @GetMapping
    public List<CategoryResponse> findAll() {

        return categoryService.findAll();
    }

    /**
     * Returns a paginated list of categories.
     *
     * @param pageable pagination parameters (default size 20)
     * @return a page of categories
     */
    @GetMapping("/paginated")
    public Page<CategoryResponse> findAllPaginated(
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return categoryService.findAllPaginated(pageable);
    }

    /**
     * Creates a new category (HTTP 201).
     *
     * @param request the category data
     * @return the created category
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(
            @Valid
            @RequestBody
            CreateCategoryRequest request
    ) {

        return categoryService.create(request);
    }

    /**
     * Deletes a category (HTTP 204).
     *
     * @param id the category ID
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id
    ) {

        categoryService.delete(id);
    }
}