import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export interface BudgetVsSpentData {
  name: string;
  budget: number;
  spent: number;
}

interface BudgetVsSpentChartProps {
  data: BudgetVsSpentData[];
}

export default function BudgetVsSpentChart({
  data
}: BudgetVsSpentChartProps) {

  if (!data || data.length === 0) {

    return (
      <div className="chart-empty">

        <span>📊</span>

        <p>
          No budget data available.
        </p>

      </div>
    );
  }

  return (

    <div className="chart-container">

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tickFormatter={(value) =>
              `${value} €`
            }
          />

          <Tooltip
            formatter={(value, name) => [
              `${Number(value).toFixed(2)} €`,
              name === 'budget'
                ? 'Budget'
                : 'Spent'
            ]}
          />

          <Legend />

          <Bar
            dataKey="budget"
            name="Budget"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
          />

          <Bar
            dataKey="spent"
            name="Spent"
            fill="#f97316"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}