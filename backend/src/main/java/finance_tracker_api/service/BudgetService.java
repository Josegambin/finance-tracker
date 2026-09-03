package finance_tracker_api.service;

import finance_tracker_api.dto.budget.BudgetResponse;
import finance_tracker_api.dto.budget.CreateBudgetRequest;
import finance_tracker_api.entity.Budget;
import finance_tracker_api.entity.Category;
import finance_tracker_api.entity.CategoryType;
import finance_tracker_api.entity.User;
import finance_tracker_api.exception.ResourceNotFoundException;
import finance_tracker_api.repository.BudgetRepository;
import finance_tracker_api.repository.CategoryRepository;
import finance_tracker_api.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

/**
 * Business logic for managing monthly budgets.
 *
 * <p>Budgets can only be created for expense categories owned by the
 * current user. A budget is unique per user, category and month, and each
 * response is enriched with the amount already spent.</p>
 */
@Service
public class BudgetService {

        private final BudgetRepository budgetRepository;

        private final CategoryRepository categoryRepository;

        private final TransactionRepository transactionRepository;

        private final CurrentUserService currentUserService;

        /**
         * Creates the budget service.
         *
         * @param budgetRepository        repository for budget persistence
         * @param categoryRepository      repository for category lookups
         * @param transactionRepository   repository used to compute spent amounts
         * @param currentUserService      resolves the authenticated user
         */
        public BudgetService(
                        BudgetRepository budgetRepository,
                        CategoryRepository categoryRepository,
                        TransactionRepository transactionRepository,
                        CurrentUserService currentUserService) {
                this.budgetRepository = budgetRepository;

                this.categoryRepository = categoryRepository;

                this.transactionRepository = transactionRepository;

                this.currentUserService = currentUserService;
        }

        /**
         * Creates a budget for the current user.
         *
         * @param request the budget data
         * @return the created budget with spending info
         * @throws ResourceNotFoundException if the category does not exist
         * @throws IllegalArgumentException  if the category is not owned,
         *                                   is not an expense category, or a
         *                                   budget already exists for the
         *                                   user/category/month combination
         */
        public BudgetResponse createBudget(
                        CreateBudgetRequest request) {

                User user = currentUserService.getCurrentUser();

                Category category = categoryRepository
                                .findById(
                                                request.categoryId())
                                .orElseThrow(
                                                () -> new ResourceNotFoundException("Category", request.categoryId()));

                /*
                 * Security: checks that the category
                 * belongs to the current user.
                 */

                if (!category.getUser()
                                .getId()
                                .equals(user.getId())) {

                        throw new IllegalArgumentException(
                                        "You cannot use this category");
                }

                /*
                 * A budget only makes sense
                 * for expense categories.
                 */

                if (category.getType() != CategoryType.EXPENSE) {

                        throw new IllegalArgumentException(
                                        "Budgets can only be created for expense categories");
                }

                /*
                 * Checks that no budget already
                 * exists for:
                 *
                 * user + category + month
                 */

                boolean budgetExists = budgetRepository
                                .findByUserIdAndCategoryIdAndMonth(
                                                user.getId(),
                                                category.getId(),
                                                request.month())
                                .isPresent();

                if (budgetExists) {

                        throw new IllegalArgumentException(
                                        "A budget already exists for this category and month");
                }

                Budget budget = new Budget(
                                user,
                                category,
                                request.month(),
                                request.amount());

                Budget savedBudget = budgetRepository.save(
                                budget);

                return toBudgetResponse(
                                savedBudget);
        }

        /**
         * Returns a page of budgets of the current user.
         *
         * @param pageable pagination information
         * @return a page of budgets with spending info
         */
        public Page<BudgetResponse> getBudgets(Pageable pageable) {

                User user = currentUserService.getCurrentUser();

                return budgetRepository
                                .findByUserId(user.getId(), pageable)
                                .map(this::toBudgetResponse);
        }

        /**
         * Returns the budgets of the current user for a specific month,
         * ordered by category name.
         *
         * @param month the month to filter by
         * @return matching budgets with spending info
         */
        public List<BudgetResponse> getBudgets(YearMonth month) {

                User user = currentUserService.getCurrentUser();

                return budgetRepository
                                .findByUserIdAndMonthOrderByCategoryNameAsc(
                                                user.getId(),
                                                month)
                                .stream()
                                .map(this::toBudgetResponse)
                                .toList();
        }

        /**
         * Deletes a budget of the current user.
         *
         * @param id the budget ID
         * @throws ResourceNotFoundException if the budget does not exist
         * @throws RuntimeException          if the budget belongs to another user
         */
        public void deleteBudget(
                        Long id) {

                User user = currentUserService.getCurrentUser();

                Budget budget = budgetRepository
                                .findById(id)
                                .orElseThrow(
                                                () -> new ResourceNotFoundException("Budget", id));

                /*
                 * Security: a user cannot delete
                 * another user's budget.
                 */

                if (!budget.getUser()
                                .getId()
                                .equals(user.getId())) {

                        throw new RuntimeException(
                                        "You cannot delete this budget");
                }

                budgetRepository.delete(
                                budget);
        }

        /**
         * Maps a budget entity to its response, computing the spent,
         * remaining and percentage data for the budget month.
         *
         * @param budget the entity to map
         * @return the enriched response DTO
         */
        private BudgetResponse toBudgetResponse(
                        Budget budget) {

                YearMonth month = budget.getMonth();

                LocalDate startDate = month.atDay(1);
                LocalDate endDate = month.plusMonths(1).atDay(1);

                BigDecimal spentAmount = transactionRepository
                                .calculateSpentAmount(
                                                budget.getUser().getId(),
                                                budget.getCategory().getId(),
                                                startDate,
                                                endDate);

                /*
                 * Por seguridad evitamos null.
                 */

                if (spentAmount == null) {

                        spentAmount = BigDecimal.ZERO;
                }

                BigDecimal remainingAmount = budget.getAmount()
                                .subtract(
                                                spentAmount);

                BigDecimal percentageUsed;

                if (budget.getAmount()
                                .compareTo(
                                                BigDecimal.ZERO) == 0) {

                        percentageUsed = BigDecimal.ZERO;

                } else {

                        percentageUsed = spentAmount
                                        .multiply(
                                                        BigDecimal.valueOf(
                                                                        100))
                                        .divide(
                                                        budget.getAmount(),
                                                        2,
                                                        RoundingMode.HALF_UP);
                }

                return new BudgetResponse(

                                budget.getId(),

                                budget.getCategory()
                                                .getId(),

                                budget.getCategory()
                                                .getName(),

                                budget.getMonth(),

                                budget.getAmount(),

                                spentAmount,

                                remainingAmount,

                                percentageUsed);
        }
}
