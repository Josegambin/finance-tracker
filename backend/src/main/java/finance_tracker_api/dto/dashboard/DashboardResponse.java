package finance_tracker_api.dto.dashboard;


import java.math.BigDecimal;
import java.util.List;

import finance_tracker_api.dto.transaction.TransactionResponse;

/**
 * Aggregated financial summary shown on the dashboard.
 *
 * @param balance           the current remaining balance
 * @param totalIncome       the total income in the selected period
 * @param totalExpenses     the total expenses in the selected period
 * @param recentTransactions the most recent transactions
 */
public record DashboardResponse(

        BigDecimal balance,

        BigDecimal totalIncome,

        BigDecimal totalExpenses,

        List<TransactionResponse> recentTransactions

) {
}
