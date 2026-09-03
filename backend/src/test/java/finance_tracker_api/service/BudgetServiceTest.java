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

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private BudgetService budgetService;

    private User user;
    private Category expenseCategory;
    private final YearMonth month = YearMonth.of(2026, 9);

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

    private static void setId(Object entity, Long id) throws Exception {
        var field = entity.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(entity, id);
    }

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

    @Test
    void deleteBudget_shouldThrow_whenNotOwner() throws Exception {
        User other = new User("Other", "other@example.com", "encoded");
        setId(other, 9L);
        Budget budget = new Budget(user, expenseCategory, month, new BigDecimal("100"));
        setId(budget, 10L);
        // budget pertenece a "user", pero quien llama es "other"
        when(currentUserService.getCurrentUser()).thenReturn(other);
        when(budgetRepository.findById(10L)).thenReturn(Optional.of(budget));

        assertThrows(RuntimeException.class, () -> budgetService.deleteBudget(10L));
        verify(budgetRepository, never()).delete(any());
    }

    @Test
    void deleteBudget_shouldThrow_whenNotFound() {
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(budgetRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> budgetService.deleteBudget(999L));
    }
}
