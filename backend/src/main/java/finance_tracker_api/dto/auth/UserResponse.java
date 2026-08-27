package finance_tracker_api.dto.auth;

public record UserResponse(
        Long id,
        String name,
        String email
) {
}
