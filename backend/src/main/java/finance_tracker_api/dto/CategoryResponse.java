package finance_tracker_api.dto;

import finance_tracker_api.entity.CategoryType;

/**
 * Public representation of a {@code Category}.
 *
 * @param id   the category ID
 * @param name the display name
 * @param type the category type (income or expense)
 */
public record CategoryResponse(

        Long id,
        String name,
        CategoryType type

) {
}
