package finance_tracker_api.service;

import finance_tracker_api.entity.Transaction;
import finance_tracker_api.entity.TransactionType;
import finance_tracker_api.entity.User;
import finance_tracker_api.repository.TransactionRepository;
import finance_tracker_api.specification.TransactionSpecification;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionExportService {

    private final TransactionRepository transactionRepository;

    private final CurrentUserService currentUserService;

    public TransactionExportService(
            TransactionRepository transactionRepository,
            CurrentUserService currentUserService
    ) {

        this.transactionRepository =
                transactionRepository;

        this.currentUserService =
                currentUserService;
    }


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