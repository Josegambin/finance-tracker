package finance_tracker_api.dto;

import finance_tracker_api.entity.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request payload for creating a new category.
 *
 * @param name the display name of the category
 * @param type the category type (income or expense)
 */
public record CreateCategoryRequest(

        @NotBlank
        String name,

        @NotNull
        CategoryType type

) {
}