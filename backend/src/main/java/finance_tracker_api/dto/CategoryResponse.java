package finance_tracker_api.dto;

import finance_tracker_api.entity.CategoryType;

public record CategoryResponse(

        Long id,
        String name,
        CategoryType type

) {
}
