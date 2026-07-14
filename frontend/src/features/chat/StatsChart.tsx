import React from 'react';

export interface ChartDataPoint {
  id: string;
  name: string;
  value: number;
  month: string;
  count: number;
}

interface StatsChartProps {
  data: ChartDataPoint[];
  dataKey?: string;
}

export const StatsChart: React.FC<StatsChartProps> = ({ data, dataKey }) => {
  if (!data?.length) {
    return <div>Aucune donnée disponible.</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-bold">Inscription Mensuelle</h2>
      <ul>
        {data.map((item) => {
          const displayValue = dataKey ? (item as any)[dataKey] ?? item.count : item.count;
          return (
            <li key={item.id}>
              {item.month}: {displayValue}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StatsChart;

