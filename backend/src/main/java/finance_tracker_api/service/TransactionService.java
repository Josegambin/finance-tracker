package finance_tracker_api.service;

import finance_tracker_api.dto.transaction.CreateTransactionRequest;
import finance_tracker_api.dto.transaction.TransactionResponse;
import finance_tracker_api.entity.Category;
import finance_tracker_api.entity.Transaction;
import finance_tracker_api.entity.User;
import finance_tracker_api.repository.CategoryRepository;

import finance_tracker_api.repository.TransactionRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final CurrentUserService currentUserService;

    public TransactionService(
            TransactionRepository transactionRepository,
            CategoryRepository categoryRepository,
            CurrentUserService currentUserService
    ) {
        this.transactionRepository =
                transactionRepository;

        this.categoryRepository =
                categoryRepository;

        this.currentUserService =
                currentUserService;
    }

    public List<TransactionResponse> findAll() {

        User user =
                currentUserService.getCurrentUser();

        return transactionRepository
                .findByUserIdOrderByDateDesc(
                        user.getId()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TransactionResponse create(
            CreateTransactionRequest request
    ) {

        User user =
                currentUserService.getCurrentUser();

        Category category =
                categoryRepository
                        .findById(request.categoryId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Category not found"
                                )
                        );

        /*
         * Seguridad:
         *
         * La categoría debe pertenecer
         * al usuario autenticado.
         */

        if (!category.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You cannot use this category"
            );
        }

        /*
         * Validamos que el tipo de la
         * categoría coincida con el tipo
         * de la transacción.
         */

        if (!category.getType()
                .name()
                .equals(request.type().name())) {

            throw new RuntimeException(
                    "Transaction type does not match category type"
            );
        }

        Transaction transaction =
                new Transaction();

        transaction.setDescription(
                request.description()
        );

        transaction.setAmount(
                request.amount()
        );

        transaction.setDate(
                request.date()
        );

        transaction.setType(
                request.type()
        );

        transaction.setCategory(
                category
        );

        transaction.setUser(user);

        Transaction savedTransaction =
                transactionRepository.save(
                        transaction
                );

        return toResponse(savedTransaction);
    }

    public void delete(Long id) {

        User user =
                currentUserService.getCurrentUser();

        Transaction transaction =
                transactionRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Transaction not found"
                                )
                        );

        /*
         * No permitimos eliminar
         * transacciones de otro usuario.
         */

        if (!transaction.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You cannot delete this transaction"
            );
        }

        transactionRepository.delete(
                transaction
        );
    }

    private TransactionResponse toResponse(
            Transaction transaction
    ) {

        return new TransactionResponse(

                transaction.getId(),

                transaction.getDescription(),

                transaction.getAmount(),

                transaction.getDate(),

                transaction.getType(),

                transaction
                        .getCategory()
                        .getId(),

                transaction
                        .getCategory()
                        .getName()
        );
    }
}
