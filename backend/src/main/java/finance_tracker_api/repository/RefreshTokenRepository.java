package finance_tracker_api.repository;

import finance_tracker_api.entity.RefreshToken;
import finance_tracker_api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data repository for {@link RefreshToken} entities.
 */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    /**
     * Finds a refresh token by its token string.
     *
     * @param token the token value to look for
     * @return the matching token, if any
     */
    Optional<RefreshToken> findByToken(String token);

    /**
     * Revokes every refresh token belonging to a user.
     *
     * @param user the user whose tokens are deleted
     */
    void deleteByUser(User user);
}