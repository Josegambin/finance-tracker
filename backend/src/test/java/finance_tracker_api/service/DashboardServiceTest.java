package finance_tracker_api.service;

import finance_tracker_api.dto.dashboard.DashboardResponse;
import finance_tracker_api.dto.dashboard.ExpenseByCategoryResponse;
import finance_tracker_api.entity.Category;
import finance_tracker_api.entity.CategoryType;
import finance_tracker_api.entity.Transaction;
import finance_tracker_api.entity.TransactionType;
import finance_tracker_api.entity.User;
import finance_tracker_api.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private DashboardService dashboardService;

    private User user;
    private Transaction income;
    private Transaction expense;
    private final YearMonth month = YearMonth.of(2026, 9);

    @BeforeEach
    void setUp() throws Exception {
        user = new User("John Doe", "john@example.com", "encoded");
        setId(user, 1L);

        Category salary = new Category();
        salary.setName("Salary");
        salary.setType(CategoryType.INCOME);
        salary.setUser(user);
        setId(salary, 1L);

        Category food = new Category();
        food.setName("Food");
        food.setType(CategoryType.EXPENSE);
        food.setUser(user);
        setId(food, 2L);

        income = buildTransaction("Salary", new BigDecimal("3000.00"), TransactionType.INCOME, salary);
        expense = buildTransaction("Groceries", new BigDecimal("450.50"), TransactionType.EXPENSE, food);
    }

    private static void setId(Object entity, Long id) throws Exception {
        var field = entity.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(entity, id);
    }

    private Transaction buildTransaction(String desc, BigDecimal amount, TransactionType type, Category category)
            throws Exception {
        Transaction t = new Transaction();
        t.setDescription(desc);
        t.setAmount(amount);
        t.setDate(LocalDate.of(2026, 9, 10));
        t.setType(type);
        t.setCategory(category);
        t.setUser(user);
        setId(t, 1L);
        return t;
    }

    @Test
    void getDashboard_shouldComputeBalanceIncomeExpenses() {
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(transactionRepository.findByUserIdAndDateGreaterThanEqualAndDateLessThanOrderByDateDesc(
                anyLong(), any(), any()))
                .thenReturn(List.of(income, expense));
        when(transactionRepository.findTop5ByUserIdAndDateGreaterThanEqualAndDateLessThanOrderByDateDesc(
                anyLong(), any(), any()))
                .thenReturn(List.of(income, expense));

        DashboardResponse response = dashboardService.getDashboard(month);

        assertNotNull(response);
        assertEquals(new BigDecimal("3000.00"), response.totalIncome());
        assertEquals(new BigDecimal("450.50"), response.totalExpenses());
        assertEquals(new BigDecimal("2549.50"), response.balance());
        assertEquals(2, response.recentTransactions().size());
    }

    @Test
    void getDashboard_shouldReturnZeroWhenNoTransactions() {
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(transactionRepository.findByUserIdAndDateGreaterThanEqualAndDateLessThanOrderByDateDesc(
                anyLong(), any(), any()))
                .thenReturn(List.of());
        when(transactionRepository.findTop5ByUserIdAndDateGreaterThanEqualAndDateLessThanOrderByDateDesc(
                anyLong(), any(), any()))
                .thenReturn(List.of());

        DashboardResponse response = dashboardService.getDashboard(month);

        assertEquals(BigDecimal.ZERO, response.totalIncome());
        assertEquals(BigDecimal.ZERO, response.totalExpenses());
        assertEquals(BigDecimal.ZERO, response.balance());
        assertTrue(response.recentTransactions().isEmpty());
    }

    @Test
    void getExpensesByCategory_shouldDelegateWithDateRange() {
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(transactionRepository.findExpensesByCategory(anyLong(), any(), any()))
                .thenReturn(List.of(new ExpenseByCategoryResponse("Food", new BigDecimal("450.50"))));

        List<ExpenseByCategoryResponse> result = dashboardService.getExpensesByCategory(month);

        assertEquals(1, result.size());
        assertEquals("Food", result.get(0).categoryName());
        assertEquals(new BigDecimal("450.50"), result.get(0).total());
    }
}
