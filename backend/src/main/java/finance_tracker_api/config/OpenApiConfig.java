package finance_tracker_api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configures the OpenAPI / Swagger documentation of the API.
 *
 * <p>Registers API metadata and a bearer-token security scheme used to
 * authenticate calls from the Swagger UI.</p>
 */
@Configuration
public class OpenApiConfig {

    /**
     * Builds the OpenAPI description for the application.
     *
     * @return the configured {@link OpenAPI} instance
     */
    @Bean
    public OpenAPI financeTrackerOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Finance Tracker API")
                        .description("API REST para seguimiento de finanzas personales")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("José Gamín")
                                .email("jose.gamin@example.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://choosealicense.com/licenses/mit/")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Introduce tu token JWT de autenticación")));
    }
}