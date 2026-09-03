import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { useTranslation } from 'react-i18next';

interface ExpenseCategory {
    categoryName: string;
    total: number;
}

interface ExpensesByCategoryChartProps {
    data: ExpenseCategory[];
}

export default function ExpensesByCategoryChart({
    data
}: ExpensesByCategoryChartProps) {
    const { t } = useTranslation();

    if (data.length === 0) {
        return (
            <div className="chart-empty">
                <span>📊</span>
                <p>{t('dashboard.noExpenseData')}</p>
            </div>
        );
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
    };

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="total"
                        nameKey="categoryName"
                        cx="50%"
                        cy="45%"
                        outerRadius={100}
                        innerRadius={55}
                        paddingAngle={3}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}