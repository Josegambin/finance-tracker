package finance_tracker_api.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import finance_tracker_api.repository.UserRepository;

/**
 * Resolves the currently authenticated user from the security context.
 *
 * <p>The email stored in the authentication principal is looked up in the
 * database and returned as a {@link User} entity.</p>
 */
@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    /**
     * Creates the current-user service.
     *
     * @param userRepository repository for user lookups
     */
    public CurrentUserService(
            finance_tracker_api.repository.UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    /**
     * Returns the authenticated user.
     *
     * @return the current {@link User}
     * @throws RuntimeException if there is no authenticated principal or
     *                          the user is no longer stored in the database
     */
    public finance_tracker_api.entity.User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"
                        )
                );
    }
}