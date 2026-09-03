package finance_tracker_api.entity;

import jakarta.persistence.*;

/**
 * JPA entity representing an application user.
 *
 * <p>Each user has a unique email address used for authentication, a
 * display name and an encoded password. All financial data (categories,
 * transactions, budgets, refresh tokens) belongs to a user.</p>
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    /**
     * Creates an empty user (required by JPA).
     */
    public User() {
    }

    /**
     * Creates a user from its basic attributes.
     *
     * @param name     the display name
     * @param email    the unique email address
     * @param password the password (already encoded)
     */
    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    /**
     * Returns the unique identifier of the user.
     *
     * @return the user ID
     */
    public Long getId() {
        return id;
    }

    /**
     * Returns the display name of the user.
     *
     * @return the user name
     */
    public String getName() {
        return name;
    }

    /**
     * Returns the unique email address of the user.
     *
     * @return the user email
     */
    public String getEmail() {
        return email;
    }

    /**
     * Returns the encoded password of the user.
     *
     * @return the encoded password
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the display name of the user.
     *
     * @param name the new name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Sets the email address of the user.
     *
     * @param email the new (unique) email
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Sets the encoded password of the user.
     *
     * @param password the new encoded password
     */
    public void setPassword(String password) {
        this.password = password;
    }
}