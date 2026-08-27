package finance_tracker_api.dto;

import finance_tracker_api.entity.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCategoryRequest(

        @NotBlank
        String name,

        @NotNull
        CategoryType type

) {
}