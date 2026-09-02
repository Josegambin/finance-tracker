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

@Service
public class DashboardService {

        private final TransactionRepository transactionRepository;
        private final CurrentUserService currentUserService;

        public DashboardService(
                        TransactionRepository transactionRepository,
                        CurrentUserService currentUserService) {

                this.transactionRepository = transactionRepository;

                this.currentUserService = currentUserService;
        }

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