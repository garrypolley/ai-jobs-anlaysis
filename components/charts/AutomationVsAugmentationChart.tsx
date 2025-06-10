'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AutomationVsAugmentationChartProps {
  data: {
    automationDominant: any[];
    augmentationDominant: any[];
    balanced: any[];
  };
}

export function AutomationVsAugmentationChart({ data }: AutomationVsAugmentationChartProps) {
  const chartData = [
    {
      name: 'Automation Dominant',
      value: data.automationDominant.length,
      color: '#dc2626',
      description: 'Tasks likely to be automated'
    },
    {
      name: 'Augmentation Dominant',
      value: data.augmentationDominant.length,
      color: '#2563eb',
      description: 'Tasks likely to be augmented by AI'
    },
    {
      name: 'Balanced Impact',
      value: data.balanced.length,
      color: '#16a34a',
      description: 'Tasks with balanced automation/augmentation potential'
    }
  ];

  const COLORS = ['#dc2626', '#2563eb', '#16a34a'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-gray-600">
                      Tasks: {data.value.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {data.description}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="font-medium">{item.name}:</span>
            <span className="text-gray-600">{item.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}