
import React, { useMemo } from 'react';
import { LuServer } from "react-icons/lu";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';



interface AnalyticsChartProps {
  stats: any; 
  loading?: boolean;
}


const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ stats, loading }) => {


  
  const chartData = useMemo(() => {
    if (!stats) return [];

    
    return Object.entries(stats.platformCounts || {}).map(([platform, count]) => ({
      name: platform,
      total: count as number,
      new: stats.newServersCount || 0,
      active: (count as number) * 0.8 
    }));
  }, [stats]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Server Statistics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Distribution across platforms and status
          </p>
        </div>
        <div className="flex items-center space-x-4">
    
          <LuServer className="w-6 h-6 text-blue-500 dark:text-blue-300" />
        </div>
      </div>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6b7280' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6b7280' }}
              label={{ 
                value: 'Servers', 
                angle: -90, 
                position: 'insideLeft', 
                fill: '#6b7280', 
                offset: -10 
              }}
            />
            <Tooltip
              cursor={{ fill: '#cbd5e1', opacity: 0.3 }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px',
                boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                color: '#1f2937'
              }}
            />
            <Legend />
            <Bar 
              name="Total Servers" 
              dataKey="total" 
              fill="#4f46e5" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              name="New Servers" 
              dataKey="new" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              name="Active Servers" 
              dataKey="active" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;