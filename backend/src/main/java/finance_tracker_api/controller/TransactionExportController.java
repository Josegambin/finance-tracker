package finance_tracker_api.controller;

import finance_tracker_api.entity.TransactionType;
import finance_tracker_api.service.TransactionExportService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST endpoints for exporting transactions as downloadable files.
 */
@RestController
@RequestMapping("/api/transactions/export")
public class TransactionExportController {

    private final TransactionExportService exportService;

    /**
     * Creates the export controller.
     *
     * @param exportService CSV export business logic
     */
    public TransactionExportController(
            TransactionExportService exportService
    ) {

        this.exportService =
                exportService;
    }


    /**
     * Downloads the filtered transactions as a CSV file.
     *
     * @param search     optional text filter
     * @param type       optional transaction type filter
     * @param categoryId optional category filter
     * @param month      optional month filter (format {@code YYYY-MM})
     * @return the CSV content as an attachment
     */
    @GetMapping("/csv")
    public ResponseEntity<String> exportCsv(

            @RequestParam(
                    required = false
            )
            String search,

            @RequestParam(
                    required = false
            )
            TransactionType type,

            @RequestParam(
                    required = false
            )
            Long categoryId,

            @RequestParam(
                    required = false
            )
            String month

    ) {

        String csv =
                exportService.exportCsv(
                        search,
                        type,
                        categoryId,
                        month
                );


        return ResponseEntity
                .ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=transactions.csv"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "text/csv"
                        )
                )
                .body(csv);
    }
}