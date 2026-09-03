package finance_tracker_api.service;

import org.springframework.stereotype.Service;

import finance_tracker_api.dto.dashboard.DashboardResponse;
import finance_tracker_api.dto.dashboard.ExpenseByCategoryResponse;
import finance_tracker_api.dto.transaction.TransactionResponse;
import finance_tracker_api.entity.Transaction;
import finance_tracker_api.entity.TransactionType;
import finance_tracker_api.entity.User;
import finance_tracker_api.repository.TransactionRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

/**
 * Builds the aggregate data shown on the dashboard.
 *
 * <p>Given a month it computes income, expenses and balance for the
 * current user plus the most recent transactions and per-category expense
 * totals.</p>
 */
@Service
public class DashboardService {

        private final TransactionRepository transactionRepository;
        private final CurrentUserService currentUserService;

        /**
         * Creates the dashboard service.
         *
         * @param transactionRepository repository for transaction queries
         * @param currentUserService    resolves the authenticated user
         */
        public DashboardService(
                        TransactionRepository transactionRepository,
                        CurrentUserService currentUserService) {

                this.transactionRepository = transactionRepository;

                this.currentUserService = currentUserService;
        }

        /**
         * Computes the dashboard summary for a whole month.
         *
         * @param month the month to analyze
         * @return the aggregated dashboard data
         */
        public DashboardResponse getDashboard(YearMonth month) {

                User user = currentUserService.getCurrentUser();

                LocalDate startDate = month.atDay(1);
                LocalDate endDate = month.plusMonths(1).atDay(1);

                List<Transaction> transactions = transactionRepository
                                .findByUserIdAndDateGreaterThanEqualAndDateLessThanOrderByDateDesc(
                                                user.getId(),
                                                startDate,
                                                endDate);

                BigDecimal totalIncome = transactions.stream()

                                .filter(transaction -> transaction.getType() == TransactionType.INCOME)

                                .map(Transaction::getAmount)

                                .reduce(
                                                BigDecimal.ZERO,
                                                BigDecimal::add);

                BigDecimal totalExpenses = transactions.stream()

                                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)

                                .map(Transaction::getAmount)

                                .reduce(
                                                BigDecimal.ZERO,
                                                BigDecimal::add);

                BigDecimal balance = totalIncome.subtract(
                                totalExpenses);

                List<TransactionResponse> recentTransactions = transactionRepository
                                .findTop5ByUserIdAndDateGreaterThanEqualAndDateLessThanOrderByDateDesc(
                                                user.getId(),
                                                startDate,
                                                endDate)
                                .stream()
                                .map(this::toTransactionResponse)
                                .toList();

                return new DashboardResponse(

                                balance,

                                totalIncome,

                                totalExpenses,

                                recentTransactions);
        }

        /**
         * Maps a transaction entity to its public response.
         *
         * @param transaction the entity to map
         * @return the response DTO
         */
        private TransactionResponse toTransactionResponse(
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

        /**
         * Aggregates expenses by category for a whole month.
         *
         * @param month the month to analyze
         * @return expense totals per category, largest first
         */
        public List<ExpenseByCategoryResponse> getExpensesByCategory(YearMonth month) {

                User user = currentUserService.getCurrentUser();

                LocalDate startDate = month.atDay(1);
                LocalDate endDate = month.plusMonths(1).atDay(1);

                return transactionRepository
                                .findExpensesByCategory(
                                                user.getId(),
                                                startDate,
                                                endDate);
        }
}