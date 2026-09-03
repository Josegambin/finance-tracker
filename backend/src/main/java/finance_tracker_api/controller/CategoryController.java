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

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(
            CategoryService categoryService
    ) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryResponse> findAll() {

        return categoryService.findAll();
    }

    @GetMapping("/paginated")
    public Page<CategoryResponse> findAllPaginated(
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return categoryService.findAllPaginated(pageable);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(
            @Valid
            @RequestBody
            CreateCategoryRequest request
    ) {

        return categoryService.create(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id
    ) {

        categoryService.delete(id);
    }
}