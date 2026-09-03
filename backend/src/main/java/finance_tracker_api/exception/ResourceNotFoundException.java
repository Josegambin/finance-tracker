package finance_tracker_api.exception;

/**
 * Thrown when a requested resource cannot be found in the database.
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Creates the exception with a custom message.
     *
     * @param message the error message
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Creates the exception with a standard "resource not found" message.
     *
     * @param resource the resource type name
     * @param id       the requested ID
     */
    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s not found with id: %d", resource, id));
    }
}