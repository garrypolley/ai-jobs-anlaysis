'use client';

import React, { useState } from 'react';

interface OccupationAnalysisProps {
  occupations: Array<{
    title?: string;
    occupation_title?: string;
    avgAutomationScore?: number;
    avg_automation_score?: number;
    taskCount?: number;
    total_tasks?: number;
    code?: string;
    occupation_code?: string;
  }>;
}

export function OccupationAnalysis({ occupations }: OccupationAnalysisProps) {
  const [sortBy, setSortBy] = useState<'score' | 'tasks' | 'title'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedOccupations = [...occupations].sort((a, b) => {
    let valueA: string | number;
    let valueB: string | number;

    switch (sortBy) {
      case 'score':
        valueA = a.avgAutomationScore || a.avg_automation_score || 0;
        valueB = b.avgAutomationScore || b.avg_automation_score || 0;
        break;
      case 'tasks':
        valueA = a.taskCount || a.total_tasks || 0;
        valueB = b.taskCount || b.total_tasks || 0;
        break;
      case 'title':
        valueA = a.title || a.occupation_title || '';
        valueB = b.title || b.occupation_title || '';
        break;
      default:
        return 0;
    }

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

  const handleSort = (column: 'score' | 'tasks' | 'title') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 0.8) return { level: 'Very High', color: 'text-red-600 bg-red-50' };
    if (score >= 0.6) return { level: 'High', color: 'text-orange-600 bg-orange-50' };
    if (score >= 0.4) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-50' };
    if (score >= 0.2) return { level: 'Low', color: 'text-blue-600 bg-blue-50' };
    return { level: 'Very Low', color: 'text-green-600 bg-green-50' };
  };

  const SortIcon = ({ column, currentSort, currentOrder }: {
    column: string,
    currentSort: string,
    currentOrder: string
  }) => {
    if (column !== currentSort) {
      return <span className="text-gray-400">↕</span>;
    }
    return currentOrder === 'asc' ? <span className="text-blue-600">↑</span> : <span className="text-blue-600">↓</span>;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-full divide-y divide-gray-200 table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center space-x-1">
                <span>Occupation</span>
                <SortIcon column="title" currentSort={sortBy} currentOrder={sortOrder} />
              </div>
            </th>
            <th
              className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('score')}
            >
              <div className="flex items-center justify-center space-x-1">
                <span>Risk %</span>
                <SortIcon column="score" currentSort={sortBy} currentOrder={sortOrder} />
              </div>
            </th>
            <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Level
            </th>
            <th
              className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('tasks')}
            >
              <div className="flex items-center justify-center space-x-1">
                <span>Tasks</span>
                <SortIcon column="tasks" currentSort={sortBy} currentOrder={sortOrder} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedOccupations.map((occupation, index) => {
            const automationScore = occupation.avgAutomationScore || occupation.avg_automation_score || 0;
            const riskInfo = getRiskLevel(automationScore);
            const title = occupation.title || occupation.occupation_title || 'Unknown';
            const code = occupation.code || occupation.occupation_code || 'N/A';
            const taskCount = occupation.taskCount || occupation.total_tasks || 0;

            return (
              <tr key={`${code}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 sm:px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 break-words">
                    {title}
                  </div>
                  <div className="text-xs text-gray-500 hidden sm:block">
                    Code: {code}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    {(automationScore * 100).toFixed(1)}%
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${riskInfo.color}`}>
                    {riskInfo.level}
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-4 text-center text-sm text-gray-900">
                  {taskCount}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {occupations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No occupation data available
        </div>
      )}
    </div>
  );
}