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

@Service
public class TransactionService {

        private final TransactionRepository transactionRepository;
        private final CategoryRepository categoryRepository;
        private final CurrentUserService currentUserService;

        public TransactionService(
                        TransactionRepository transactionRepository,
                        CategoryRepository categoryRepository,
                        CurrentUserService currentUserService) {
                this.transactionRepository = transactionRepository;

                this.categoryRepository = categoryRepository;

                this.currentUserService = currentUserService;
        }

        public TransactionPageResponse findAll(
                        Pageable pageable,
                        String search,
                        TransactionType type,
                        Long categoryId,
                        String month) {

                User user = currentUserService.getCurrentUser();

                /*
                 * Specification base:
                 *
                 * Solo recuperamos las transacciones
                 * pertenecientes al usuario autenticado.
                 */
                Specification<Transaction> specification = TransactionSpecification.hasUserId(
                                user.getId());

                /*
                 * Filtro Search.
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

        public TransactionResponse create(
                        CreateTransactionRequest request) {

                User user = currentUserService.getCurrentUser();

                Category category = categoryRepository
                                .findById(request.categoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category", request.categoryId()));

                /*
                 * Seguridad:
                 *
                 * La categoría debe pertenecer
                 * al usuario autenticado.
                 */

                if (!category.getUser()
                                .getId()
                                .equals(user.getId())) {

                        throw new IllegalArgumentException(
                                        "You cannot use this category");
                }

                /*
                 * Validamos que el tipo de la
                 * categoría coincida con el tipo
                 * de la transacción.
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

        public void delete(Long id) {

                User user = currentUserService.getCurrentUser();

                Transaction transaction = transactionRepository
                                .findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Transaction", id));

                /*
                 * No permitimos eliminar
                 * transacciones de otro usuario.
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
