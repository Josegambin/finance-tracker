package finance_tracker_api.service;

import finance_tracker_api.dto.transaction.CreateTransactionRequest;
import finance_tracker_api.dto.transaction.TransactionPageResponse;
import finance_tracker_api.dto.transaction.TransactionResponse;
import finance_tracker_api.entity.Category;
import finance_tracker_api.entity.CategoryType;
import finance_tracker_api.entity.Transaction;
import finance_tracker_api.entity.TransactionType;
import finance_tracker_api.entity.User;
import finance_tracker_api.exception.ResourceNotFoundException;
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
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private TransactionService transactionService;

    private User user;
    private Category category;
    private Transaction transaction;

    @BeforeEach
    void setUp() {
        user = new User("John Doe", "john@example.com", "encoded");
        // Asignamos id vía reflexión para simular persistencia
        setId(user, 1L);

        category = new Category();
        category.setName("Salary");
        category.setType(CategoryType.INCOME);
        category.setUser(user);
        setId(category, 10L);

        transaction = new Transaction();
        transaction.setDescription("Monthly salary");
        transaction.setAmount(new BigDecimal("2500.00"));
        transaction.setDate(LocalDate.of(2026, 9, 15));
        transaction.setType(TransactionType.INCOME);
        transaction.setCategory(category);
        transaction.setUser(user);
        setId(transaction, 100L);
    }

    private static void setId(Object entity, Long id) {
        try {
            var field = entity.getClass().getDeclaredField("id");
            field.setAccessible(true);
            field.set(entity, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void create_shouldPersistTransaction_whenCategoryOwnedAndTypeMatches() {
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(categoryRepository.findById(10L)).thenReturn(Optional.of(category));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        CreateTransactionRequest request = new CreateTransactionRequest(
                "Monthly salary",
                new BigDecimal("2500.00"),
                LocalDate.of(2026, 9, 15),
                TransactionType.INCOME,
                10L);

        TransactionResponse response = transactionService.create(request);

        assertNotNull(response);
        assertEquals(100L, response.id());
        assertEquals("Monthly salary", response.description());
        assertEquals("Salary", response.categoryName());
        verify(transactionRepository).save(any(Transaction.class));
    }

    @Test
    void create_shouldThrow_whenCategoryNotFound() {
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        CreateTransactionRequest request = new CreateTransactionRequest(
                "Salary",
                new BigDecimal("100"),
                LocalDate.now(),
                TransactionType.INCOME,
                99L);

        assertThrows(ResourceNotFoundException.class, () -> transactionService.create(request));
        verify(transactionRepository, never()).save(any(Transaction.class));
    }

    @Test
    void create_shouldThrow_whenCategoryBelongsToAnotherUser() {
        User otherUser = new User("Other", "other@example.com", "encoded");
        setId(otherUser, 2L);
        category.setUser(otherUser);

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(categoryRepository.findById(10L)).thenReturn(Optional.of(category));

        CreateTransactionRequest request = new CreateTransactionRequest(
                "Salary",
                new BigDecimal("100"),
                LocalDate.now(),
                TransactionType.INCOME,
                10L);

        assertThrows(IllegalArgumentException.class, () -> transactionService.create(request));
        verify(transactionRepository, never()).save(any(Transaction.class));
    }

    @Test
    void create_shouldThrow_whenCategoryTypeDoesNotMatchTransactionType() {
        category.setType(CategoryType.EXPENSE);

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(categoryRepository.findById(10L)).thenReturn(Optional.of(category));

        CreateTransactionRequest request = new CreateTransactionRequest(
                "Salary",
                new BigDecimal("100"),
                LocalDate.now(),
                TransactionType.INCOME,
                10L);

        assertThrows(IllegalArgumentException.class, () -> transactionService.create(request));
        verify(transactionRepository, never()).save(any(Transaction.class));
    }

    @Test
    void findAll_shouldApplyAllFiltersAndReturnPage() {
        when(currentUserService.getCurrentUser()).thenReturn(user);

        Page<Transaction> page = new PageImpl<>(
                List.of(transaction),
                PageRequest.of(0, 5),
                1);
        when(transactionRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(page);

        TransactionPageResponse response = transactionService.findAll(
                PageRequest.of(0, 5),
                "salary",
                TransactionType.INCOME,
                10L,
                "2026-09");

        assertNotNull(response);
        assertEquals(1, response.totalElements());
        assertEquals(1, response.content().size());
        assertEquals("Monthly salary", response.content().get(0).description());
    }

    @Test
    void delete_shouldThrow_whenTransactionBelongsToAnotherUser() {
        User otherUser = new User("Other", "other@example.com", "encoded");
        setId(otherUser, 2L);
        transaction.setUser(otherUser);

        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(transactionRepository.findById(100L)).thenReturn(Optional.of(transaction));

        assertThrows(RuntimeException.class, () -> transactionService.delete(100L));
        verify(transactionRepository, never()).delete(any(Transaction.class));
    }

    @Test
    void delete_shouldDelete_whenTransactionOwnedByCurrentUser() {
        when(currentUserService.getCurrentUser()).thenReturn(user);
        when(transactionRepository.findById(100L)).thenReturn(Optional.of(transaction));

        transactionService.delete(100L);

        verify(transactionRepository).delete(transaction);
    }
}
