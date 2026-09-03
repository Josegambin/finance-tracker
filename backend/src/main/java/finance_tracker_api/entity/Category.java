package finance_tracker_api.entity;

import jakarta.persistence.*;

/**
 * JPA entity representing a spending or income category owned by a user.
 *
 * <p>A category groups transactions together and can be of type
 * {@link CategoryType#INCOME} or {@link CategoryType#EXPENSE}. Every
 * category is associated with exactly one {@link User}.</p>
 */
@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    /**
     * Returns the unique identifier of the category.
     *
     * @return the category ID
     */
    public Long getId() {
        return id;
    }

    /**
     * Returns the display name of the category.
     *
     * @return the category name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the display name of the category.
     *
     * @param name the new category name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Returns the type of the category (income or expense).
     *
     * @return the category type
     */
    public CategoryType getType() {
        return type;
    }

    /**
     * Sets the type of the category.
     *
     * @param type the new category type
     */
    public void setType(CategoryType type) {
        this.type = type;
    }

    /**
     * Returns the user who owns the category.
     *
     * @return the owning user
     */
    public User getUser() {
        return user;
    }

    /**
     * Sets the user who owns the category.
     *
     * @param user the new owner
     */
    public void setUser(User user) {
        this.user = user;
    }
}
