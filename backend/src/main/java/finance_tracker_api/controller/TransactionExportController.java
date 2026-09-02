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

@RestController
@RequestMapping("/api/transactions/export")
public class TransactionExportController {

    private final TransactionExportService exportService;

    public TransactionExportController(
            TransactionExportService exportService
    ) {

        this.exportService =
                exportService;
    }


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