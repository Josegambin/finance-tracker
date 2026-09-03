package finance_tracker_api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Exposes a simple health check endpoint.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    /**
     * Reports the application status.
     *
     * @return a map with the status and application name
     */
    @GetMapping("/health")
    public Map<String, String> health() {

        return Map.of(
                "status", "UP",
                "application", "Finance Tracker API"
        );
    }
}