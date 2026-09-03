package finance_tracker_api.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * REST endpoints for user profile information.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    /**
     * Returns the email of the authenticated user.
     *
     * @param authentication the current security principal
     * @return the profile summary
     */
    @GetMapping("/me")
    public Map<String, String> me(
            Authentication authentication
    ) {

        return Map.of(
                "email",
                authentication.getName(),
                "message",
                "Authenticated successfully"
        );
    }
}