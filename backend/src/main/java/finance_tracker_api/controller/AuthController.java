package finance_tracker_api.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import finance_tracker_api.dto.auth.LoginRequest;
import finance_tracker_api.dto.auth.LoginResponse;
import finance_tracker_api.dto.auth.RefreshTokenRequest;
import finance_tracker_api.dto.auth.RegisterRequest;
import finance_tracker_api.dto.auth.UserResponse;
import finance_tracker_api.service.AuthService;
import finance_tracker_api.service.JwtService;
import finance_tracker_api.service.RefreshTokenService;

/**
 * REST endpoints for authentication: register, login, token refresh and
 * logout.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    /**
     * Creates the authentication controller.
     *
     * @param authService           authentication business logic
     * @param refreshTokenService   refresh token lifecycle
     * @param jwtService            JWT creation
     */
    public AuthController(
            AuthService authService,
            RefreshTokenService refreshTokenService,
            JwtService jwtService
    ) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
        this.jwtService = jwtService;
    }

    /**
     * Registers a new user account.
     *
     * @param request the registration data
     * @return the created user (HTTP 201)
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return authService.register(request);
    }

    /**
     * Authenticates a user and returns fresh tokens.
     *
     * @param request the login credentials
     * @return access and refresh tokens
     */
    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }

    /**
     * Exchanges a valid refresh token for a new access token and a rotated
     * refresh token.
     *
     * @param request the refresh token
     * @return the new tokens
     */
    @PostMapping("/refresh")
    public LoginResponse refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        var refreshToken = refreshTokenService.verifyRefreshToken(request.refreshToken());
        String newAccessToken = jwtService.generateToken(refreshToken.getUser().getEmail());
        String newRefreshToken = refreshTokenService.createRefreshToken(refreshToken.getUser());
        return new LoginResponse(newAccessToken, newRefreshToken);
    }

    /**
     * Revokes the given refresh token (HTTP 204).
     *
     * @param request the refresh token to revoke
     */
    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        refreshTokenService.deleteRefreshToken(request.refreshToken());
    }
}
