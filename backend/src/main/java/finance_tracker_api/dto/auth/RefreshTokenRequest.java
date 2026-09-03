package finance_tracker_api.dto.auth;

import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for refreshing an expired access token.
 *
 * @param refreshToken the refresh token value
 */
public record RefreshTokenRequest(
        @NotBlank(message = "Refresh token is required")
        String refreshToken
) {
}