package finance_tracker_api.controller;

import finance_tracker_api.dto.auth.LoginRequest;
import finance_tracker_api.dto.auth.LoginResponse;
import finance_tracker_api.dto.auth.RegisterRequest;
import finance_tracker_api.dto.auth.UserResponse;
import finance_tracker_api.config.RateLimitConfig;
import finance_tracker_api.service.AuthService;
import finance_tracker_api.service.CustomUserDetailsService;
import finance_tracker_api.service.JwtService;
import finance_tracker_api.service.RefreshTokenService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Web-layer tests for {@link AuthController} using MockMvc.
 */
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

  /** MVC entry point for sending requests to the auth endpoints. */
  @Autowired
  private MockMvc mockMvc;

  /** Mocked authentication service. */
  @MockitoBean
  private AuthService authService;

  /** Mocked refresh-token service. */
  @MockitoBean
  private RefreshTokenService refreshTokenService;

  /** Mocked JWT utility service. */
  @MockitoBean
  private JwtService jwtService;

  /** Mocked user-details service required by the security context. */
  @MockitoBean
  private CustomUserDetailsService customUserDetailsService;

  /** Mocked rate-limit configuration so limits are disabled in tests. */
  @MockitoBean
  private RateLimitConfig rateLimitConfig;

  /** JSON payload for a valid registration request. */
  private static final String REGISTER_BODY = "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}";

  /** JSON payload for a valid login request. */
  private static final String LOGIN_BODY = "{\"email\":\"john@example.com\",\"password\":\"password123\"}";

  /**
   * Returns 201 CREATED with the user payload on successful
   * registration.
   */
  @Test
  void register_shouldReturnCreated_withUserResponse() throws Exception {
    when(authService.register(any(RegisterRequest.class)))
        .thenAnswer(inv -> {
          RegisterRequest req = inv.getArgument(0);
          return new UserResponse(1L, req.name(), req.email());
        });

    mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(REGISTER_BODY))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.email").value("john@example.com"));
  }

  /**
   * Returns 400 BAD REQUEST when the registration payload is invalid.
   */
  @Test
  void register_shouldReturn400_whenPayloadInvalid() throws Exception {
    mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"name\":\"\",\"email\":\"not-an-email\",\"password\":\"\"}"))
        .andExpect(status().isBadRequest());
  }

  /**
   * Returns the access and refresh tokens on successful login.
   */
  @Test
  void login_shouldReturnTokens() throws Exception {
    when(authService.login(any(LoginRequest.class)))
        .thenReturn(new LoginResponse("access-token", "refresh-token"));

    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(LOGIN_BODY))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").value("access-token"))
        .andExpect(jsonPath("$.refreshToken").value("refresh-token"));
  }
}
