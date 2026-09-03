package finance_tracker_api.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Creates and validates JSON Web Tokens (JWT).
 *
 * <p>The signing key is derived from the configured secret and every
 * token carries an expiration based on the configured lifetime.</p>
 */
@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expiration;

    /**
     * Creates the JWT service and derives the HMAC signing key from the
     * configured secret.
     *
     * @param secret     the HMAC secret (must be long enough for HS256)
     * @param expiration the access token lifetime in milliseconds
     */
    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.expiration}") long expiration
    ) {
        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
        this.expiration = expiration;
    }

    /**
     * Generates a signed JWT for the given email.
     *
     * @param email the subject of the token
     * @return a compact JWT string
     */
    public String generateToken(String email) {

        Date now = new Date();
        Date expirationDate =
                new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expirationDate)
                .signWith(secretKey)
                .compact();
    }

    /**
     * Extracts the email (subject) from a valid token.
     *
     * @param token the JWT to parse
     * @return the subject of the token
     */
    public String extractEmail(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    /**
     * Checks whether a token is well-formed, signed and not expired.
     *
     * @param token the JWT to validate
     * @return {@code true} if the token is valid
     */
    public boolean isValid(String token) {

        try {

            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (Exception exception) {

            return false;
        }
    }
}