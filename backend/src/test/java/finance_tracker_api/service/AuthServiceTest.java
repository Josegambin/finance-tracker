package finance_tracker_api.service;

import finance_tracker_api.dto.auth.LoginRequest;
import finance_tracker_api.dto.auth.LoginResponse;
import finance_tracker_api.dto.auth.RegisterRequest;
import finance_tracker_api.dto.auth.UserResponse;
import finance_tracker_api.entity.User;
import finance_tracker_api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link AuthService} using Mockito.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    /** Mocked user repository. */
    @Mock
    private UserRepository userRepository;

    /** Mocked password encoder. */
    @Mock
    private PasswordEncoder passwordEncoder;

    /** Mocked Spring Security authentication manager. */
    @Mock
    private AuthenticationManager authenticationManager;

    /** Mocked JWT token service. */
    @Mock
    private JwtService jwtService;

    /** Mocked refresh-token service. */
    @Mock
    private RefreshTokenService refreshTokenService;

    /** The service under test, with mocked dependencies injected. */
    @InjectMocks
    private AuthService authService;

    /** Valid registration payload used in tests. */
    private RegisterRequest registerRequest;

    /** Valid login payload used in tests. */
    private LoginRequest loginRequest;

    /** A persisted user fixture. */
    private User user;

    /**
     * Initialises the shared request/user fixtures before each test.
     */
    @BeforeEach
    void setUp() throws Exception {
        registerRequest = new RegisterRequest("John Doe", "john@example.com", "password123");
        loginRequest = new LoginRequest("john@example.com", "password123");
        user = new User("John Doe", "john@example.com", "encodedPassword");
        setId(user, 1L);
    }

    /**
     * Assigns an {@code id} to an entity reflectively, simulating
     * persistence so that identifiers are available in tests.
     *
     * @param entity the entity to mutate
     * @param id     the identifier to assign
     */
    private static void setId(Object entity, Long id) throws Exception {
        var field = entity.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(entity, id);
    }

    /**
     * Registers a user when the email is not taken.
     */
    @Test
    void register_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("John Doe", response.name());
        assertEquals("john@example.com", response.email());

        verify(userRepository).existsByEmail("john@example.com");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
    }

    /**
     * Rejects registration when the email is already registered.
     */
    @Test
    void register_EmailAlreadyExists() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(registerRequest));

        verify(userRepository).existsByEmail("john@example.com");
        verify(userRepository, never()).save(any(User.class));
    }

    /**
     * Logs a user in and returns fresh tokens.
     */
    @Test
    void login_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(anyString())).thenReturn("jwt-token");
        when(refreshTokenService.createRefreshToken(any(User.class))).thenReturn("refresh-token");

        LoginResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("jwt-token", response.accessToken());
        assertEquals("refresh-token", response.refreshToken());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService).generateToken("john@example.com");
        verify(refreshTokenService).createRefreshToken(user);
    }
}