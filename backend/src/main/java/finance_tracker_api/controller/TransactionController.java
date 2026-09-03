package finance_tracker_api.controller;

import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import finance_tracker_api.dto.transaction.CreateTransactionRequest;
import finance_tracker_api.dto.transaction.TransactionPageResponse;
import finance_tracker_api.dto.transaction.TransactionResponse;
import finance_tracker_api.entity.TransactionType;
import finance_tracker_api.service.TransactionService;

/**
 * REST endpoints for managing transaction resources.
 */
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

        private final TransactionService transactionService;

        /**
         * Creates the transaction controller.
         *
         * @param transactionService transaction business logic
         */
        public TransactionController(
                        TransactionService transactionService) {
                this.transactionService = transactionService;
        }

        /**
         * Returns a paginated, filterable list of transactions.
         *
         * @param search     optional text filter
         * @param type       optional transaction type filter
         * @param categoryId optional category filter
         * @param month      optional month filter (format {@code YYYY-MM})
         * @param pageable   pagination parameters (default size 10, sorted by
         *                   date descending)
         * @return the paginated results
         */
        @GetMapping
        public ResponseEntity<TransactionPageResponse> findAll(
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false) TransactionType type,
                        @RequestParam(required = false) Long categoryId,
                        @RequestParam(required = false) String month,
                        @PageableDefault(size = 10, sort = "date", direction = Sort.Direction.DESC) Pageable pageable

        ) {

                return ResponseEntity.ok(
                                transactionService.findAll(
                                                pageable,
                                                search,
                                                type,
                                                categoryId,
                                                month));
        }

        /**
         * Creates a new transaction (HTTP 201).
         *
         * @param request the transaction data
         * @return the created transaction
         */
        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        public TransactionResponse create(
                        @Valid @RequestBody CreateTransactionRequest request) {

                return transactionService.create(
                                request);
        }

        /**
         * Deletes a transaction (HTTP 204).
         *
         * @param id the transaction ID
         */
        @DeleteMapping("/{id}")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public void delete(
                        @PathVariable Long id) {

                transactionService.delete(id);
        }
}