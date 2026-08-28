package finance_tracker_api.dto.dashboard;


import java.math.BigDecimal;
import java.util.List;

import finance_tracker_api.dto.transaction.TransactionResponse;

public record DashboardResponse(

        BigDecimal balance,

        BigDecimal totalIncome,

        BigDecimal totalExpenses,

        List<TransactionResponse> recentTransactions

) {
}
