package finance_tracker_api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import finance_tracker_api.entity.RefreshToken;
import finance_tracker_api.entity.User;
import finance_tracker_api.repository.RefreshTokenRepository;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Creates, validates and revokes refresh tokens.
 *
 * <p>Only one active refresh token is kept per user: creating a new token
 * revokes the previous ones. Expired tokens are removed when they are
 * verified.</p>
 */
@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final long refreshTokenExpirationMs;

    /**
     * Creates the refresh token service.
     *
     * @param refreshTokenRepository    repository for refresh token persistence
     * @param refreshTokenExpirationMs  token lifetime in milliseconds
     */
    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            @Value("${security.jwt.refresh-expiration}") long refreshTokenExpirationMs
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    /**
     * Issues a new refresh token for a user, revoking any previous one.
     *
     * @param user the user the token belongs to
     * @return the generated token string
     */
    @Transactional
    public String createRefreshToken(User user) {
        // Delete existing refresh tokens for user
        refreshTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusSeconds(refreshTokenExpirationMs / 1000);

        RefreshToken refreshToken = new RefreshToken(token, user, expiryDate);
        refreshTokenRepository.save(refreshToken);

        return token;
    }

    /**
     * Validates a refresh token and returns it.
     *
     * @param token the token value to verify
     * @return the stored refresh token entity
     * @throws IllegalArgumentException if the token is unknown or expired
     */
    @Transactional
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new IllegalArgumentException("Refresh token expired");
        }

        return refreshToken;
    }

    /**
     * Revokes a specific refresh token.
     *
     * @param token the token value to revoke
     * @throws IllegalArgumentException if the token is unknown
     */
    @Transactional
    public void deleteRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        refreshTokenRepository.delete(refreshToken);
    }
}