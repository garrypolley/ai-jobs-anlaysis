'use client';

import React from 'react';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Jobs Impact Analysis
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Analyzing white-collar job displacement using Anthropic's Economic Index
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              Data Source: Anthropic Economic Index
            </div>
            <div className="text-sm text-gray-500">
              Release: 2025-03-27
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}