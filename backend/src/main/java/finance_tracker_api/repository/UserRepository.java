package finance_tracker_api.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import finance_tracker_api.entity.User;

import java.util.Optional;

/**
 * Spring Data repository for {@link User} entities.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by its unique email address.
     *
     * @param email the email to look for
     * @return the matching user, if any
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks whether a user with the given email already exists.
     *
     * @param email the email to check
     * @return {@code true} if a user with that email exists
     */
    boolean existsByEmail(String email);
}