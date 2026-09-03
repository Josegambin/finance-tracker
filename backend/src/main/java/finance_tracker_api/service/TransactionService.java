package finance_tracker_api.service;

import finance_tracker_api.dto.transaction.CreateTransactionRequest;
import finance_tracker_api.dto.transaction.TransactionPageResponse;
import finance_tracker_api.dto.transaction.TransactionResponse;
import finance_tracker_api.entity.Category;
import finance_tracker_api.entity.Transaction;
import finance_tracker_api.entity.TransactionType;
import finance_tracker_api.entity.User;
import finance_tracker_api.exception.InvalidRequestException;
import finance_tracker_api.exception.ResourceNotFoundException;
import finance_tracker_api.repository.CategoryRepository;
import finance_tracker_api.repository.TransactionRepository;
import finance_tracker_api.specification.TransactionSpecification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.List;

/**
 * Business logic for managing financial transactions.
 *
 * <p>All queries are scoped to the current user and support dynamic
 * filtering through JPA {@link Specification}s. Transactions can only be
 * created with categories owned by the current user whose type matches the
 * transaction type.</p>
 */
@Service
public class TransactionService {

        private final TransactionRepository transactionRepository;
        private final CategoryRepository categoryRepository;
        private final CurrentUserService currentUserService;

        /**
         * Creates the transaction service.
         *
         * @param transactionRepository repository for transaction persistence
         * @param categoryRepository      repository for category lookups
         * @param currentUserService      resolves the authenticated user
         */
        public TransactionService(
                        TransactionRepository transactionRepository,
                        CategoryRepository categoryRepository,
                        CurrentUserService currentUserService) {
                this.transactionRepository = transactionRepository;

                this.categoryRepository = categoryRepository;

                this.currentUserService = currentUserService;
        }

        /**
         * Returns a page of transactions for the current user matching the
         * given optional filters.
         *
         * @param pageable   pagination information
         * @param search     optional text filter on description/category name
         * @param type       optional transaction type filter
         * @param categoryId optional category filter
         * @param month      optional month filter (format {@code YYYY-MM})
         * @return the paginated results
         * @throws InvalidRequestException if the month format is invalid
         */
        public TransactionPageResponse findAll(
                        Pageable pageable,
                        String search,
                        TransactionType type,
                        Long categoryId,
                        String month) {

                User user = currentUserService.getCurrentUser();

                /*
                 * Base specification: only fetches
                 * the transactions that belong
                 * to the authenticated user.
                 */
                Specification<Transaction> specification = TransactionSpecification.hasUserId(
                                user.getId());

                /*
                 * Search filter.
                 */
                if (search != null && !search.isBlank()) {

                        specification = specification.and(
                                        TransactionSpecification.hasSearch(
                                                        search));
                }

                /*
                 * Filtro Type.
                 */
                if (type != null) {

                        specification = specification.and(
                                        TransactionSpecification.hasType(
                                                        type));
                }

                /*
                 * Filtro Category.
                 */
                if (categoryId != null) {

                        specification = specification.and(
                                        TransactionSpecification.hasCategoryId(
                                                        categoryId));
                }

                /*
                 * Filtro Month.
                 */
               if (month != null && !month.isBlank()) {

                   try {
                       YearMonth.parse(month);
                   } catch (Exception e) {
                       throw new InvalidRequestException(
                               "Invalid month format. Expected YYYY-MM"
                       );
                   }

                   specification =
                           specification.and(
                                   TransactionSpecification.hasMonth(
                                           month
                                   )
                           );
               }

                Page<Transaction> page = transactionRepository.findAll(
                                specification,
                                pageable);

                List<TransactionResponse> content = page.getContent()
                                .stream()
                                .map(this::toResponse)
                                .toList();

                return new TransactionPageResponse(
                                content,
                                page.getTotalElements(),
                                page.getTotalPages(),
                                page.getNumber(),
                                page.getSize());
        }

        /**
         * Creates a transaction for the current user.
         *
         * @param request the transaction data
         * @return the created transaction
         * @throws ResourceNotFoundException if the category does not exist
         * @throws IllegalArgumentException  if the category belongs to another
         *                                   user or its type does not match
         *                                   the transaction type
         */
        public TransactionResponse create(
                        CreateTransactionRequest request) {

                User user = currentUserService.getCurrentUser();

                Category category = categoryRepository
                                .findById(request.categoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category", request.categoryId()));

                /*
                 * Security: the category must belong
                 * to the authenticated user.
                 */

                if (!category.getUser()
                                .getId()
                                .equals(user.getId())) {

                        throw new IllegalArgumentException(
                                        "You cannot use this category");
                }

                /*
                 * Validates that the category type
                 * matches the transaction type.
                 */

                if (!category.getType()
                                .name()
                                .equals(request.type().name())) {

                        throw new IllegalArgumentException(
                                        "Transaction type does not match category type");
                }

                Transaction transaction = new Transaction();

                transaction.setDescription(
                                request.description());

                transaction.setAmount(
                                request.amount());

                transaction.setDate(
                                request.date());

                transaction.setType(
                                request.type());

                transaction.setCategory(
                                category);

                transaction.setUser(user);

                Transaction savedTransaction = transactionRepository.save(
                                transaction);

                return toResponse(savedTransaction);
        }

        /**
         * Deletes a transaction of the current user.
         *
         * @param id the transaction ID
         * @throws ResourceNotFoundException if the transaction does not exist
         * @throws RuntimeException          if the transaction belongs to another user
         */
        public void delete(Long id) {

                User user = currentUserService.getCurrentUser();

                Transaction transaction = transactionRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));

                /*
                 * Deletion of transactions that
                 * belong to another user is not allowed.
                 */

                if (!transaction.getUser()
                                .getId()
                                .equals(user.getId())) {

                        throw new RuntimeException(
                                        "You cannot delete this transaction");
                }

                transactionRepository.delete(
                                transaction);
        }

        /**
         * Maps a transaction entity to its public response.
         *
         * @param transaction the entity to map
         * @return the response DTO
         */
        private TransactionResponse toResponse(
                        Transaction transaction) {

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
                                                .getName());
        }
}
