package finance_tracker_api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity representing a token used to obtain new access tokens.
 *
 * <p>Each refresh token belongs to a {@link User}, carries a unique token
 * string and an expiry date. When the token expires it can no longer be
 * used to refresh an authenticated session.</p>
 */
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    /**
     * Creates an empty refresh token (required by JPA).
     */
    public RefreshToken() {
    }

    /**
     * Creates a refresh token with an expiry and a creation timestamp set
     * to the current time.
     *
     * @param token      the unique token string
     * @param user       the user the token belongs to
     * @param expiryDate the moment the token becomes invalid
     */
    public RefreshToken(String token, User user, LocalDateTime expiryDate) {
        this.token = token;
        this.user = user;
        this.expiryDate = expiryDate;
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Returns the unique identifier of the refresh token.
     *
     * @return the token ID
     */
    public Long getId() {
        return id;
    }

    /**
     * Returns the token string.
     *
     * @return the token value
     */
    public String getToken() {
        return token;
    }

    /**
     * Sets the token string.
     *
     * @param token the new token value
     */
    public void setToken(String token) {
        this.token = token;
    }

    /**
     * Returns the user the token belongs to.
     *
     * @return the owning user
     */
    public User getUser() {
        return user;
    }

    /**
     * Sets the user the token belongs to.
     *
     * @param user the new owner
     */
    public void setUser(User user) {
        this.user = user;
    }

    /**
     * Returns the moment the token becomes invalid.
     *
     * @return the expiry date
     */
    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    /**
     * Sets the expiry date of the token.
     *
     * @param expiryDate the new expiry date
     */
    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    /**
     * Returns the moment the token was created.
     *
     * @return the creation timestamp
     */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    /**
     * Sets the creation timestamp of the token.
     *
     * @param createdAt the new creation timestamp
     */
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Checks whether the token has already expired.
     *
     * @return {@code true} if the current time is after the expiry date
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
}