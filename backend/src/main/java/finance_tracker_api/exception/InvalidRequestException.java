package finance_tracker_api.exception;

/**
 * Thrown when a request is semantically invalid, such as a malformed
 * query parameter.
 */
public class InvalidRequestException
        extends RuntimeException {

    /**
     * Creates the exception with a message.
     *
     * @param message the reason for the failure
     */
    public InvalidRequestException(String message) {
        super(message);
    }
}

