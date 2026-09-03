package finance_tracker_api.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import finance_tracker_api.dto.auth.LoginRequest;
import finance_tracker_api.dto.auth.LoginResponse;
import finance_tracker_api.dto.auth.RegisterRequest;
import finance_tracker_api.dto.auth.UserResponse;
import finance_tracker_api.entity.User;
import finance_tracker_api.repository.UserRepository;

/**
 * Handles user registration and authentication.
 *
 * <p>Registration encodes the raw password and persists a new
 * {@link User}. Login validates credentials through Spring Security and
 * issues an access token plus a refresh token.</p>
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    /**
     * Creates the authentication service with all its dependencies.
     *
     * @param userRepository         repository for user persistence
     * @param passwordEncoder        used to encode and verify passwords
     * @param authenticationManager  Spring Security authentication manager
     * @param jwtService             issues access tokens
     * @param refreshTokenService    manages refresh tokens
     */
    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtService jwtService,
        RefreshTokenService refreshTokenService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    /**
     * Registers a new user.
     *
     * @param request the registration data
     * @return the public representation of the created user
     * @throws IllegalArgumentException if the email is already registered
     */
    @Transactional
    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }

        String encodedPassword =
                passwordEncoder.encode(request.password());

        User user = new User(
                request.name(),
                request.email(),
                encodedPassword
        );

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }

    /**
     * Authenticates a user and issues fresh tokens.
     *
     * @param request the login credentials
     * @return an access token and a refresh token
     * @throws org.springframework.security.core.AuthenticationException
     *         if the credentials are invalid
     */
    @Transactional
    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String accessToken =
                jwtService.generateToken(request.email());

        String refreshToken =
                refreshTokenService.createRefreshToken(user);

        return new LoginResponse(accessToken, refreshToken);
    }
}