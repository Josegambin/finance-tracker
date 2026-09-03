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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link BudgetService} using Mockito.
 */
@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    /** Mocked budget repository. */
    @Mock
    private BudgetRepository budgetRepository;

    /** Mocked category repository. */
    @Mock
    private CategoryRepository categoryRepository;

    /** Mocked transaction repository used for spent-amount lookups. */
    @Mock
    private TransactionRepository transactionRepository;

    /** Mocked service resolving the authenticated user. */
    @Mock
    private CurrentUserService currentUserService;

    /** The service under test, with mocked dependencies injected. */
    @InjectMocks
    private BudgetService budgetService;

    /** The authenticated user fixture. */
    private User user;

    /** An expense category owned by {@link #user}. */
    private Category expenseCategory;

    /** Fixed month used across tests. */
    private final YearMonth month = YearMonth.of(2026, 9);

    /**
     * Initialises the user and expense-category fixtures before each test.
     */
    @BeforeEach
    void setUp() throws Exception {
        user = new User("John Doe", "john@example.com", "encoded");
        setId(user, 1L);

        expenseCategory = new Category();
        expenseCategory.setName("Food");
        expenseCategory.setType(CategoryType.EXPENSE);
        expenseCategory.setUser(user);
        setId(expenseCategory, 2L);
    }

    /**
     * Assigns a {@code id} to an entity reflectively, simulating
     * persistence so that identifiers are available in tests.
     *
     * @param entity the entity to mutate
     * @param id     the identifier to assign
     */
    private static void setId(Object entity, Long id) throws Exception {
        var field = entity.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(entity, id);
    }

    /**
     * Persists a budget when the category is a valid owned expense
     * category.
     */
    @Test
    void createBudget_shouldPersist_whenValidExpenseCategory() throws Exception {
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(expenseCategory));
        when(budgetRepository.findByUserIdAndCategoryIdAndMonth(anyLong(), anyLong(), any()))
                .thenReturn(Optional.empty());

        Budget saved = new Budget(user, expenseCategory, month, new BigDecimal("500.00"));
        setId(saved, 10L);
        when(budgetRepository.save(any(Budget.class))).thenReturn(saved);

        BudgetResponse response = budgetService
                .createBudget(new CreateBudgetRequest(2L, month, new BigDecimal("500.00")));

        assertNotNull(response);
        assertEquals(10L, response.id());
        assertEquals("Food", response.categoryName());
        assertEquals(month, response.month());
        verify(budgetRepository).save(any(Budget.class));
    }

    /**
     * Rejects budgets for income categories.
     */
    @Test
    void createBudget_shouldThrow_whenCategoryIsIncome() {
        Category incomeCategory = new Category();
        incomeCategory.setName("Salary");
        incomeCategory.setType(CategoryType.INCOME);
        incomeCategory.setUser(user);

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(incomeCategory));

        assertThrows(IllegalArgumentException.class,
                () -> budgetService.createBudget(new CreateBudgetRequest(2L, month, new BigDecimal("500"))));
        verify(budgetRepository, never()).save(any());
    }

    /**
     * Rejects budgets that reference another user's category.
     */
    @Test
    void createBudget_shouldThrow_whenCategoryBelongsToAnotherUser() throws Exception {
        User other = new User("Other", "other@example.com", "encoded");
        setId(other, 99L);
        expenseCategory.setUser(other);

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(expenseCategory));

        assertThrows(IllegalArgumentException.class,
                () -> budgetService.createBudget(new CreateBudgetRequest(2L, month, new BigDecimal("500"))));
    }

    /**
     * Rejects a duplicate budget for the same user, category and month.
     */
    @Test
    void createBudget_shouldThrow_whenBudgetAlreadyExists() {
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(expenseCategory));
        when(budgetRepository.findByUserIdAndCategoryIdAndMonth(anyLong(), anyLong(), any()))
                .thenReturn(Optional.of(new Budget(user, expenseCategory, month, new BigDecimal("100"))));

        assertThrows(IllegalArgumentException.class,
                () -> budgetService.createBudget(new CreateBudgetRequest(2L, month, new BigDecimal("500"))));
        verify(budgetRepository, never()).save(any());
    }

    /**
     * Enriches budgets with spent, remaining and percentage data.
     */
    @Test
    void getBudgets_shouldIncludeSpentAndPercentage() throws Exception {
        Budget budget = new Budget(user, expenseCategory, month, new BigDecimal("500.00"));
        setId(budget, 10L);

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(transactionRepository.calculateSpentAmount(anyLong(), anyLong(), any(), any()))
                .thenReturn(new BigDecimal("250.00"));
        when(budgetRepository.findByUserIdAndMonthOrderByCategoryNameAsc(anyLong(), any()))
                .thenReturn(List.of(budget));

        List<BudgetResponse> response = budgetService.getBudgets(month);

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals(new BigDecimal("500.00"), response.get(0).budgetAmount());
        assertEquals(new BigDecimal("250.00"), response.get(0).spentAmount());
        assertEquals(new BigDecimal("250.00"), response.get(0).remainingAmount());
        assertEquals(new BigDecimal("50.00"), response.get(0).percentageUsed());
    }

    /**
     * Treats a null spent amount as zero.
     */
    @Test
    void getBudgets_shouldHandleNullSpentAmount() throws Exception {
        Budget budget = new Budget(user, expenseCategory, month, new BigDecimal("500.00"));
        setId(budget, 10L);

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(budgetRepository.findByUserIdAndMonthOrderByCategoryNameAsc(anyLong(), any()))
                .thenReturn(List.of(budget));
        when(transactionRepository.calculateSpentAmount(anyLong(), anyLong(), any(), any()))
                .thenReturn(null);

        List<BudgetResponse> response = budgetService.getBudgets(month);

        assertEquals(BigDecimal.ZERO, response.get(0).spentAmount());
        assertEquals(new BigDecimal("500.00"), response.get(0).remainingAmount());
    }

    /**
     * Returns budgets as a paginated result.
     */
    @Test
    void getBudgetsPaginated_shouldReturnPage() throws Exception {
        Budget budget = new Budget(user, expenseCategory, month, new BigDecimal("500.00"));
        setId(budget, 10L);

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(budgetRepository.findByUserId(anyLong(), any()))
                .thenReturn(new PageImpl<>(List.of(budget)));
        when(transactionRepository.calculateSpentAmount(anyLong(), anyLong(), any(), any()))
                .thenReturn(BigDecimal.ZERO);

        Page<BudgetResponse> page = budgetService.getBudgets(PageRequest.of(0, 20));

        assertEquals(1, page.getTotalElements());
        assertEquals(10L, page.getContent().get(0).id());
    }

    /**
     * Prevents a user from deleting another user's budget.
     */
    @Test
    void deleteBudget_shouldThrow_whenNotOwner() throws Exception {
        User other = new User("Other", "other@example.com", "encoded");
        setId(other, 9L);
        Budget budget = new Budget(user, expenseCategory, month, new BigDecimal("100"));
        setId(budget, 10L);
        // The budget belongs to "user", but the caller is "other".
        when(currentUserService.getCurrentUser()).thenReturn(other);
        when(budgetRepository.findById(10L)).thenReturn(Optional.of(budget));

        assertThrows(RuntimeException.class, () -> budgetService.deleteBudget(10L));
        verify(budgetRepository, never()).delete(any());
    }

    /**
     * Throws when the budget to delete does not exist.
     */
    @Test
    void deleteBudget_shouldThrow_whenNotFound() {
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(budgetRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> budgetService.deleteBudget(999L));
    }
}
