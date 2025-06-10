'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AutomationRiskChartProps {
  data: Array<{
    title?: string;
    occupation_title?: string;
    avgAutomationScore?: number;
    avg_automation_score?: number;
    taskCount?: number;
    total_tasks?: number;
  }>;
}

export function AutomationRiskChart({ data }: AutomationRiskChartProps) {
  // Transform data for the chart
  const chartData = data.slice(0, 12).map(item => {
    const title = item.title || item.occupation_title || 'Unknown';
    const score = item.avgAutomationScore || item.avg_automation_score || 0;
    const taskCount = item.taskCount || item.total_tasks || 0;

    return {
      name: title.length > 20 ? title.substring(0, 18) + '...' : title,
      fullName: title,
      score: Math.round(score * 100),
      taskCount
    };
  });

  const getBarColor = (score: number) => {
    if (score >= 80) return '#dc2626'; // red-600
    if (score >= 60) return '#ea580c'; // orange-600
    if (score >= 40) return '#d97706'; // amber-600
    return '#16a34a'; // green-600
  };

  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 40,
            bottom: 120,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={120}
            fontSize={11}
            interval={0}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            label={{ value: 'Automation Risk (%)', angle: -90, position: 'insideLeft' }}
            fontSize={11}
          />
          <Tooltip
            formatter={(value: number, name: string, props: any) => [
              `${value}%`,
              'Automation Risk'
            ]}
            labelFormatter={(label: string, props: any) => {
              const item = props?.[0]?.payload;
              return item ? item.fullName : label;
            }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                    <p className="font-semibold">{data.fullName}</p>
                    <p className="text-red-600">
                      Automation Risk: {data.score}%
                    </p>
                    <p className="text-gray-600 text-sm">
                      Tasks analyzed: {data.taskCount}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="score">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}