package finance_tracker_api.dto.auth;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for authenticating an existing user.
 *
 * @param email    the user email address
 * @param password the user password
 */
public record LoginRequest(

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email")
        String email,

        @NotBlank(message = "Password is required")
        String password
) {
}