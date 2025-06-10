'use client';

import React, { useState, useEffect } from 'react';
import { DataLoader } from '@/utils/dataLoader';
import { DataSummary } from '@/types/data';
import { SummaryCards } from './SummaryCards';
import { AutomationRiskChart } from './charts/AutomationRiskChart';
import { AutomationVsAugmentationChart } from './charts/AutomationVsAugmentationChart';
import { OccupationAnalysis } from './OccupationAnalysis';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { Header } from './Header';

export function Dashboard() {
  const [dataSummary, setDataSummary] = useState<DataSummary | null>(null);
  const [topRiskOccupations, setTopRiskOccupations] = useState<any[]>([]);
  const [automationAnalysis, setAutomationAnalysis] = useState<any>(null);
  const [occupationSummaries, setOccupationSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const dataLoader = new DataLoader();

      const [summary, occupations, analysis, summaries] = await Promise.all([
        dataLoader.generateDataSummary(),
        dataLoader.getTopAutomationRiskOccupations(15),
        dataLoader.getAutomationVsAugmentationAnalysis(),
        dataLoader.getOccupationSummaries()
      ]);

      setDataSummary(summary);
      setTopRiskOccupations(occupations);
      setAutomationAnalysis(analysis);
      setOccupationSummaries(summaries.slice(0, 50));
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner message="Loading Anthropic Economic Index data..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage
            message={error}
            onRetry={loadData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Executive Summary */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Executive Summary: AI's Impact on White-Collar Jobs
            </h2>
            <div className="prose max-w-none text-gray-700">
              <p className="text-lg leading-relaxed">
                Based on Anthropic's Economic Index analysis, this dashboard provides a comprehensive view
                of how artificial intelligence is reshaping the white-collar job market. The data reveals
                significant automation risks across various occupations, with particular impact on entry-level
                positions as highlighted in recent industry reports.
              </p>
            </div>
          </div>

          {dataSummary && <SummaryCards summary={dataSummary} />}
        </section>

        {/* Key Insights */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Key Insights from the Data
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h3 className="font-semibold text-red-800 mb-2">Automation Risk Alert</h3>
              <p className="text-red-700 text-sm">
                                 {dataSummary?.highRiskJobs} tasks show high automation risk (&gt;70% automation score),
                indicating significant potential job displacement in affected occupations.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h3 className="font-semibold text-blue-800 mb-2">Augmentation Opportunity</h3>
              <p className="text-blue-700 text-sm">
                Average augmentation score of {dataSummary?.avgAugmentationScore} suggests AI can
                enhance human capabilities in many roles rather than replace them entirely.
              </p>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Automation vs Augmentation Analysis
            </h2>
            <div className="w-full h-[400px]">
              {automationAnalysis && (
                <AutomationVsAugmentationChart data={automationAnalysis} />
              )}
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Highest Risk Occupations
            </h2>
            <div className="w-full">
              <AutomationRiskChart data={topRiskOccupations} />
            </div>
          </section>
        </div>

        {/* Detailed Analysis */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Detailed Occupation Analysis
          </h2>
          <div className="w-full">
            <OccupationAnalysis occupations={occupationSummaries.length > 0 ? occupationSummaries : topRiskOccupations} />
          </div>
        </section>

        {/* Context and Methodology */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About This Analysis
          </h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              This analysis is based on Anthropic's Economic Index, which evaluates the potential for
              AI automation and augmentation across different occupational tasks. The data reflects
              current AI capabilities and their projected impact on various job functions.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <p className="text-yellow-800 text-sm">
                <strong>Important Note:</strong> These projections are based on current AI capabilities
                and should be interpreted as indicators of potential impact rather than definitive
                predictions. The actual timeline and extent of job displacement may vary significantly
                based on adoption rates, regulatory factors, and economic conditions.
              </p>
            </div>
            <p>
              <strong>Data Sources:</strong> Anthropic Economic Index (Release 2025-03-27),
              O*NET Database, Bureau of Labor Statistics Standard Occupational Classification (SOC) data.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}