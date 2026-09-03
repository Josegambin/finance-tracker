package finance_tracker_api.dto.auth;

/**
 * Response payload returned after a successful login or token refresh.
 *
 * @param accessToken  the JWT used to authenticate API requests
 * @param refreshToken the token used to obtain new access tokens
 */
public record LoginResponse(
        String accessToken,
        String refreshToken
) {
}
