import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface ExpenseCategory {
    name: string;
    amount: number;
}

interface ExpensesByCategoryChartProps {
    data: ExpenseCategory[];
}

export default function ExpensesByCategoryChart({
    data
}: ExpensesByCategoryChartProps) {

    if (data.length === 0) {

        return (
            <div className="chart-empty">
                <span>📊</span>

                <p>
                    No expense data available.
                </p>
            </div>
        );
    }

    return (

        <div className="chart-container">

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="amount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={55}
                        paddingAngle={3}
                    >

                        {data.map(
                            (_, index) => (

                                <Cell
                                    key={`cell-${index}`}
                                />

                            )
                        )}

                    </Pie>

                    <Tooltip />

                    <Legend />

                </PieChart>

            </ResponsiveContainer>

        </div>
    );
}