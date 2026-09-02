package finance_tracker_api.specification;

import finance_tracker_api.entity.Transaction;
import finance_tracker_api.entity.TransactionType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.YearMonth;

public class TransactionSpecification {

    private TransactionSpecification() {
    }

    public static Specification<Transaction> hasUserId(
            Long userId
    ) {

        return (
                root,
                query,
                criteriaBuilder
        ) -> criteriaBuilder.equal(
                root.get("user").get("id"),
                userId
        );
    }

    public static Specification<Transaction> hasSearch(
            String search
    ) {

        return (
                root,
                query,
                criteriaBuilder
        ) -> {

            String pattern =
                    "%" + search.toLowerCase() + "%";

            return criteriaBuilder.or(

                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get("description")
                            ),
                            pattern
                    ),

                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    root.get("category")
                                            .get("name")
                            ),
                            pattern
                    )
            );
        };
    }

    public static Specification<Transaction> hasType(
            TransactionType type
    ) {

        return (
                root,
                query,
                criteriaBuilder
        ) -> criteriaBuilder.equal(
                root.get("type"),
                type
        );
    }

    public static Specification<Transaction> hasCategoryId(
            Long categoryId
    ) {

        return (
                root,
                query,
                criteriaBuilder
        ) -> criteriaBuilder.equal(
                root.get("category").get("id"),
                categoryId
        );
    }

    public static Specification<Transaction> hasMonth(
            String month
    ) {

        YearMonth yearMonth =
                YearMonth.parse(month);

        LocalDate startDate =
                yearMonth.atDay(1);

        LocalDate endDate =
                yearMonth.atEndOfMonth();

        return (
                root,
                query,
                criteriaBuilder
        ) -> criteriaBuilder.between(
                root.get("date"),
                startDate,
                endDate
        );
    }
}