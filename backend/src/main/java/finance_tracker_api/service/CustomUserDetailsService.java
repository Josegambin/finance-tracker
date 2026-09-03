package finance_tracker_api.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import finance_tracker_api.entity.User;
import finance_tracker_api.repository.UserRepository;

/**
 * Loads user details from the database for Spring Security.
 *
 * <p>The email is used as the username because it is the unique login
 * identifier.</p>
 */
@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Creates the user details service.
     *
     * @param userRepository repository for user persistence
     */
    public CustomUserDetailsService(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    /**
     * Loads the user by email and wraps it in a Spring Security
     * {@link UserDetails}.
     *
     * @param email the user email
     * @return the Spring Security user details
     * @throws UsernameNotFoundException if no user has that email
     */
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found"
                        )
                );

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("USER")
                .build();
    }
}