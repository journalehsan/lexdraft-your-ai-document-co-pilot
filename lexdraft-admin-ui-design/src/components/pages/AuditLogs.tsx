import React from 'react';
import { Search, FileText, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

export function AuditLogs() {
  const logs = [
    { id: 1, time: '2023-10-27 10:24:12', user: 'admin@lexdraft.ai', action: 'Policy Update', resource: 'Model Config', severity: 'info' },
    { id: 2, time: '2023-10-27 09:15:00', user: 'system', action: 'API Error', resource: 'Anthropic Provider', severity: 'error' },
    { id: 3, time: '2023-10-27 08:45:33', user: 'sarah@pearsonspecter.com', action: 'Export Data', resource: 'Case #4021', severity: 'warning' },
    { id: 4, time: '2023-10-26 16:20:11', user: 'mike@pearsonspecter.com', action: 'Login Success', resource: 'Web App', severity: 'info' },
    { id: 5, time: '2023-10-26 14:12:05', user: 'unknown', action: 'Login Failed', resource: 'Web App', severity: 'warning' },
    { id: 6, time: '2023-10-26 11:30:00', user: 'system', action: 'Quota Reset', resource: 'Org #12', severity: 'info' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">View detailed system events and user actions for compliance.</p>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search by user, action, or resource..."
            className="pl-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <option value="all">All Severities</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
        <button className="h-10 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 font-medium text-sm">
          Export Logs
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">User / Actor</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Resource</th>
                <th className="px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{log.time}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "flex items-center gap-1.5 w-fit px-2 py-1 rounded-full text-xs font-medium border",
                      log.severity === 'info' ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800" :
                      log.severity === 'warning' ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800" :
                      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                    )}>
                      {log.severity === 'info' && <Info className="w-3 h-3" />}
                      {log.severity === 'warning' && <AlertTriangle className="w-3 h-3" />}
                      {log.severity === 'error' && <AlertCircle className="w-3 h-3" />}
                      <span className="capitalize">{log.severity}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{log.user}</td>
                  <td className="px-6 py-4">{log.action}</td>
                  <td className="px-6 py-4 text-muted-foreground">{log.resource}</td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:underline flex items-center gap-1">
                      <FileText className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
