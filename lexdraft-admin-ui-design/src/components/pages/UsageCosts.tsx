import React from 'react';
import { Calendar, Download } from 'lucide-react';

export function UsageCosts() {
  const usageData = [
    { model: 'GPT-4 Turbo', provider: 'OpenAI', tokens: '45.2M', cost: '$452.00', trend: '+12%' },
    { model: 'Claude 3 Opus', provider: 'Anthropic', tokens: '12.8M', cost: '$192.00', trend: '+5%' },
    { model: 'Claude 3 Sonnet', provider: 'Anthropic', tokens: '8.5M', cost: '$25.50', trend: '-2%' },
    { model: 'GPT-3.5 Turbo', provider: 'OpenAI', tokens: '120.4M', cost: '$60.20', trend: '+1%' },
    { model: 'Mistral Large', provider: 'Mistral', tokens: '5.1M', cost: '$40.80', trend: '+15%' },
  ];

  const chartData = [65, 59, 80, 81, 56, 55, 40, 70, 45, 90, 60, 75];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Usage & Costs</h1>
          <p className="text-muted-foreground">Monitor token consumption and provider costs.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 font-medium text-sm">
            <Calendar className="w-4 h-4" /> This Month
          </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 font-medium text-sm">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total Cost (MTD)</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">$770.50</span>
            <span className="text-sm text-green-600 dark:text-green-400">+8.2%</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total Tokens</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">192.0M</span>
            <span className="text-sm text-green-600 dark:text-green-400">+12.5%</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Avg. Cost / 1k Tokens</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">$0.004</span>
            <span className="text-sm text-red-600 dark:text-red-400">-2.1%</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Cost Trend (Last 12 Days)</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {chartData.map((value, i) => (
            <div key={i} className="w-full bg-secondary hover:bg-primary/80 transition-colors rounded-t-sm relative group" style={{ height: `${value}%` }}>
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                 ${(value * 2.5).toFixed(2)}
               </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Day 1</span>
          <span>Day 6</span>
          <span>Day 12</span>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Usage by Model</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted">
              <tr>
                <th className="px-6 py-3">Model</th>
                <th className="px-6 py-3">Provider</th>
                <th className="px-6 py-3">Tokens</th>
                <th className="px-6 py-3">Cost</th>
                <th className="px-6 py-3">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usageData.map((item, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{item.model}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.provider}</td>
                  <td className="px-6 py-4">{item.tokens}</td>
                  <td className="px-6 py-4">{item.cost}</td>
                  <td className="px-6 py-4 text-green-600 dark:text-green-400">{item.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
