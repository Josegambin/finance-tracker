package finance_tracker_api.config;

import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertTrue;

class CorsAllowedOriginsPropertyTest {

    @Test
    void applicationYamlShouldExposeViteDevOriginForFrontendLogin() throws Exception {
        String yaml = Files.readString(Path.of("src/main/resources/application.yaml"));
        assertTrue(yaml.contains("http://localhost:5173"),
                "Expected default CORS origins in application.yaml to include the Vite frontend origin");
    }
}
