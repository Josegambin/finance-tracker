package finance_tracker_api.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * MVC-level CORS configuration for the API endpoints.
 */
@Configuration
public class CorsConfig {

    /**
     * Registers the allowed cross-origin mappings for {@code /api/**}.
     *
     * @return the MVC CORS configurer
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {

        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry
                        .addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods(
                                "GET",
                                "POST",
                                "PUT",
                                "DELETE",
                                "OPTIONS"
                        )
                        .allowedHeaders("*");
            }
        };
    }
}