package finance_tracker_api.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * JPA entity representing a single financial transaction.
 *
 * <p>A transaction records a monetary movement (income or expense) for a
 * {@link User}, optionally linked to a {@link Category} and dated with a
 * {@link LocalDate}.</p>
 */
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(
            nullable = false,
            precision = 19,
            scale = 2
    )
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "category_id",
            nullable = false
    )
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    /**
     * Returns the unique identifier of the transaction.
     *
     * @return the transaction ID
     */
    public Long getId() {
        return id;
    }

    /**
     * Returns the human-readable description of the transaction.
     *
     * @return the transaction description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the description of the transaction.
     *
     * @param description the new description
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Returns the monetary amount of the transaction.
     *
     * @return the transaction amount
     */
    public BigDecimal getAmount() {
        return amount;
    }

    /**
     * Sets the monetary amount of the transaction.
     *
     * @param amount the new amount
     */
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    /**
     * Returns the date on which the transaction took place.
     *
     * @return the transaction date
     */
    public LocalDate getDate() {
        return date;
    }

    /**
     * Sets the date of the transaction.
     *
     * @param date the new date
     */
    public void setDate(LocalDate date) {
        this.date = date;
    }

    /**
     * Returns the type of the transaction (income or expense).
     *
     * @return the transaction type
     */
    public TransactionType getType() {
        return type;
    }

    /**
     * Sets the type of the transaction.
     *
     * @param type the new transaction type
     */
    public void setType(TransactionType type) {
        this.type = type;
    }

    /**
     * Returns the category associated with the transaction.
     *
     * @return the assigned category
     */
    public Category getCategory() {
        return category;
    }

    /**
     * Sets the category of the transaction.
     *
     * @param category the new category
     */
    public void setCategory(Category category) {
        this.category = category;
    }

    /**
     * Returns the user who owns the transaction.
     *
     * @return the owning user
     */
    public User getUser() {
        return user;
    }

    /**
     * Sets the user who owns the transaction.
     *
     * @param user the new owner
     */
    public void setUser(User user) {
        this.user = user;
    }
}