package finance_tracker_api.dto.auth;

/**
 * Public representation of a {@code User} without sensitive data.
 *
 * @param id    the user ID
 * @param name  the display name
 * @param email the email address
 */
public record UserResponse(
        Long id,
        String name,
        String email
) {
}
