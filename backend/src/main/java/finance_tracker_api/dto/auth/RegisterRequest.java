package finance_tracker_api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request payload for creating a new user account.
 *
 * @param name     the display name of the user
 * @param email    the unique email address
 * @param password the raw password (at least 8 characters)
 */
public record RegisterRequest(

        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name cannot exceed 100 characters")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100,
                message = "Password must contain between 8 and 100 characters")
        String password
) {
}