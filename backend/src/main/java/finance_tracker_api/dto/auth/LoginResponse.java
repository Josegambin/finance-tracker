package finance_tracker_api.dto.auth;

public record LoginResponse(
        String accessToken,
        String refreshToken
) {
}
