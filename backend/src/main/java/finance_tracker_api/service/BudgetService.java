package finance_tracker_api.service;

import org.springframework.stereotype.Service;
import finance_tracker_api.dto.budget.BudgetResponse;
import finance_tracker_api.dto.budget.CreateBudgetRequest;
import finance_tracker_api.entity.Budget;
import finance_tracker_api.entity.Category;
import finance_tracker_api.entity.CategoryType;
import finance_tracker_api.entity.User;
import finance_tracker_api.repository.BudgetRepository;
import finance_tracker_api.repository.CategoryRepository;
import finance_tracker_api.repository.TransactionRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class BudgetService {

        private final BudgetRepository budgetRepository;

        private final CategoryRepository categoryRepository;

        private final TransactionRepository transactionRepository;

        private final CurrentUserService currentUserService;

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

        public BudgetResponse createBudget(
                        CreateBudgetRequest request) {

                User user = currentUserService.getCurrentUser();

                Category category = categoryRepository
                                .findById(
                                                request.categoryId())
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "Category not found"));

                /*
                 * Seguridad:
                 * comprobamos que la categoría
                 * pertenece al usuario actual.
                 */

                if (!category.getUser()
                                .getId()
                                .equals(user.getId())) {

                        throw new RuntimeException(
                                        "You cannot use this category");
                }

                /*
                 * Un presupuesto solo tiene sentido
                 * para categorías de gasto.
                 */

                if (category.getType() != CategoryType.EXPENSE) {

                        throw new RuntimeException(
                                        "Budgets can only be created for expense categories");
                }

                /*
                 * Comprobamos que no exista ya
                 * un presupuesto para:
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

                        throw new RuntimeException(
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

        public List<BudgetResponse> getBudgets() {

                User user = currentUserService.getCurrentUser();

                return budgetRepository
                                .findByUserIdOrderByMonthDesc(
                                                user.getId())
                                .stream()
                                .map(
                                                this::toBudgetResponse)
                                .toList();
        }

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

        public void deleteBudget(
                        Long id) {

                User user = currentUserService.getCurrentUser();

                Budget budget = budgetRepository
                                .findById(id)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "Budget not found"));

                /*
                 * Seguridad:
                 * un usuario no puede borrar
                 * el presupuesto de otro usuario.
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
