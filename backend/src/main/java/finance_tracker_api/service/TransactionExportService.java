package finance_tracker_api.service;

import finance_tracker_api.entity.Transaction;
import finance_tracker_api.entity.TransactionType;
import finance_tracker_api.entity.User;
import finance_tracker_api.repository.TransactionRepository;
import finance_tracker_api.specification.TransactionSpecification;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Exports the user's transactions to CSV format.
 *
 * <p>Applies the same filters as the transaction listing and produces a
 * UTF-8 CSV with a BOM and a semicolon separator.</p>
 */
@Service
public class TransactionExportService {

    private final TransactionRepository transactionRepository;

    private final CurrentUserService currentUserService;

    /**
     * Creates the export service.
     *
     * @param transactionRepository repository for transaction queries
     * @param currentUserService    resolves the authenticated user
     */
    public TransactionExportService(
            TransactionRepository transactionRepository,
            CurrentUserService currentUserService
    ) {

        this.transactionRepository =
                transactionRepository;

        this.currentUserService =
                currentUserService;
    }


    /**
     * Builds a CSV document with the filtered transactions of the current
     * user.
     *
     * @param search     optional text filter on description/category name
     * @param type       optional transaction type filter
     * @param categoryId optional category filter
     * @param month      optional month filter (format {@code YYYY-MM})
     * @return the CSV content (with UTF-8 BOM)
     */
    public String exportCsv(
            String search,
            TransactionType type,
            Long categoryId,
            String month
    ) {

        User user =
                currentUserService.getCurrentUser();


        Specification<Transaction> specification =
                TransactionSpecification.hasUserId(
                        user.getId()
                );


        /*
         * Search
         */

        if (
                search != null &&
                !search.isBlank()
        ) {

            specification =
                    specification.and(
                            TransactionSpecification.hasSearch(
                                    search
                            )
                    );
        }


        /*
         * Type
         */

        if (type != null) {

            specification =
                    specification.and(
                            TransactionSpecification.hasType(
                                    type
                            )
                    );
        }


        /*
         * Category
         */

        if (categoryId != null) {

            specification =
                    specification.and(
                            TransactionSpecification.hasCategoryId(
                                    categoryId
                            )
                    );
        }


        /*
         * Month
         */

        if (
                month != null &&
                !month.isBlank()
        ) {

            specification =
                    specification.and(
                            TransactionSpecification.hasMonth(
                                    month
                            )
                    );
        }


        /*
         * Find transactions
         */

        List<Transaction> transactions =
                transactionRepository.findAll(
                        specification
                );


        /*
         * CSV
         *
         * UTF-8 BOM
         * Semicolon separator
         */

        StringBuilder csv =
                new StringBuilder();

        csv.append("\uFEFF");


        /*
         * Header
         */

        csv.append(
                "ID;Descripción;Importe;Fecha;Tipo;Categoría"
        );

        csv.append("\n");


        /*
         * Data
         */

        for (
                Transaction transaction :
                transactions
        ) {

            csv.append(
                    transaction.getId()
            );

            csv.append(";");


            csv.append(
                    escapeCsv(
                            transaction.getDescription()
                    )
            );

            csv.append(";");


            csv.append(
                    transaction.getAmount()
            );

            csv.append(";");


            csv.append(
                    transaction.getDate()
            );

            csv.append(";");


            csv.append(
                    transaction.getType()
            );

            csv.append(";");


            csv.append(
                    escapeCsv(
                            transaction
                                    .getCategory()
                                    .getName()
                    )
            );

            csv.append("\n");
        }


        return csv.toString();
    }


    /**
     * Escapes a value for a semicolon-separated CSV document.
     *
     * <p>Values containing a separator, quotes or line breaks are enclosed
     * in double quotes and embedded quotes are doubled.</p>
     *
     * @param value the raw value (may be {@code null})
     * @return the escaped value
     */
    private String escapeCsv(
            String value
    ) {

        if (value == null) {

            return "";
        }


        /*
         * CSV with semicolon separator.
         *
         * A value must be enclosed in quotes
         * when it contains:
         *
         * ;
         * "
         * newline
         */

        if (
                value.contains(";") ||
                value.contains("\"") ||
                value.contains("\n") ||
                value.contains("\r")
        ) {

            return "\""
                    + value.replace(
                            "\"",
                            "\"\""
                    )
                    + "\"";
        }


        return value;
    }
}