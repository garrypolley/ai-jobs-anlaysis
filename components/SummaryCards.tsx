'use client';

import React from 'react';
import { DataSummary } from '@/types/data';

interface SummaryCardsProps {
  summary: DataSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Occupations Analyzed',
      value: summary.totalOccupations.toLocaleString(),
      description: 'Different job categories evaluated for AI impact',
      color: 'blue'
    },
    {
      title: 'Total Tasks Evaluated',
      value: summary.totalTasks.toLocaleString(),
      description: 'Individual work tasks analyzed across all occupations',
      color: 'green'
    },
    {
      title: 'Average Automation Risk',
      value: `${(summary.avgAutomationScore * 100).toFixed(1)}%`,
      description: 'Mean likelihood of task automation across all jobs',
      color: 'red'
    },
    {
      title: 'Average Augmentation Potential',
      value: `${(summary.avgAugmentationScore * 100).toFixed(1)}%`,
      description: 'Mean potential for AI to enhance human capabilities',
      color: 'purple'
    },
    {
      title: 'High Risk Tasks',
      value: summary.highRiskJobs.toLocaleString(),
      description: 'Tasks with >70% automation probability',
      color: 'orange'
    },
    {
      title: 'Low Risk Tasks',
      value: summary.lowRiskJobs.toLocaleString(),
      description: 'Tasks with <30% automation probability',
      color: 'teal'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      red: 'bg-red-50 border-red-200 text-red-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
      orange: 'bg-orange-50 border-orange-200 text-orange-900',
      teal: 'bg-teal-50 border-teal-200 text-teal-900'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border-2 ${getColorClasses(card.color)}`}
        >
          <div className="text-2xl font-bold mb-1">
            {card.value}
          </div>
          <div className="font-semibold text-sm mb-2">
            {card.title}
          </div>
          <div className="text-xs opacity-75">
            {card.description}
          </div>
        </div>
      ))}
    </div>
  );
}