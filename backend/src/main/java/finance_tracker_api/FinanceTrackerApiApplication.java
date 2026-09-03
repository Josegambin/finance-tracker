package finance_tracker_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point of the Finance Tracker REST API.
 */
@SpringBootApplication
public class FinanceTrackerApiApplication {

	/**
	 * Starts the Spring Boot application.
	 *
	 * @param args command line arguments
	 */
	public static void main(String[] args) {
	SpringApplication.run(FinanceTrackerApiApplication.class, args);
	}
}