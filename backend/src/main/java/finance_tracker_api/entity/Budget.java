package finance_tracker_api.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.YearMonth;

/**
 * JPA entity representing a monthly budget assigned to a category.
 *
 * <p>A budget caps how much a {@link User} plans to spend on a
 * {@link Category} during a given {@link YearMonth}. A user may have at
 * most one budget per category and month (enforced by a unique
 * constraint).</p>
 */
@Entity
@Table(
        name = "budgets",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "user_id",
                                "category_id",
                                "month"
                        }
                )
        }
)
public class Budget {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )
    private Long id;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "category_id",
            nullable = false
    )
    private Category category;

    @Column(
            nullable = false
    )
    private YearMonth month;

    @Column(
            nullable = false,
            precision = 19,
            scale = 2
    )
    private BigDecimal amount;

    /**
     * Creates an empty budget (required by JPA).
     */
    public Budget() {
    }

    /**
     * Creates a fully-initialized budget.
     *
     * @param user     the user who owns the budget
     * @param category the category the budget applies to
     * @param month    the month the budget refers to
     * @param amount   the budgeted amount
     */
    public Budget(
            User user,
            Category category,
            YearMonth month,
            BigDecimal amount
    ) {
        this.user = user;
        this.category = category;
        this.month = month;
        this.amount = amount;
    }

    /**
     * Returns the unique identifier of the budget.
     *
     * @return the budget ID
     */
    public Long getId() {
        return id;
    }

    /**
     * Returns the user who owns the budget.
     *
     * @return the owning user
     */
    public User getUser() {
        return user;
    }

    /**
     * Returns the category the budget applies to.
     *
     * @return the budgeted category
     */
    public Category getCategory() {
        return category;
    }

    /**
     * Returns the month the budget refers to.
     *
     * @return the budget month
     */
    public YearMonth getMonth() {
        return month;
    }

    /**
     * Returns the budgeted amount.
     *
     * @return the budget amount
     */
    public BigDecimal getAmount() {
        return amount;
    }

    /**
     * Updates the budgeted amount.
     *
     * @param amount the new amount
     */
    public void setAmount(
            BigDecimal amount
    ) {
        this.amount = amount;
    }
}
