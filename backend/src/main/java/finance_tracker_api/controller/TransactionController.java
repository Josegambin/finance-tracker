package finance_tracker_api.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import finance_tracker_api.dto.transaction.CreateTransactionRequest;
import finance_tracker_api.dto.transaction.TransactionResponse;
import finance_tracker_api.service.TransactionService;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService
    ) {
        this.transactionService =
                transactionService;
    }

    @GetMapping
    public List<TransactionResponse> findAll() {

        return transactionService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse create(
            @Valid
            @RequestBody
            CreateTransactionRequest request
    ) {

        return transactionService.create(
                request
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id
    ) {

        transactionService.delete(id);
    }
}
