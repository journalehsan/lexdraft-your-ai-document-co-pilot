import React from 'react';
import { Users, Zap, Coins, HardDrive, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

function KPICard({ title, value, change, icon: Icon, trend }: { title: string, value: string, change: string, icon: any, trend: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-secondary rounded-full text-primary">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className={cn(
          "ml-2 text-xs font-medium px-2 py-0.5 rounded-full",
          trend === 'up' ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
          trend === 'down' ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" :
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
        )}>
          {change}
        </span>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Active Users" value="1,284" change="+12%" icon={Users} trend="up" />
        <KPICard title="Agent Runs (Today)" value="4,392" change="+8%" icon={Zap} trend="up" />
        <KPICard title="Token Spend (MTD)" value="$12,450" change="-2%" icon={Coins} trend="up" />
        <KPICard title="Cache Savings" value="$3,100" change="+15%" icon={HardDrive} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted">
                <tr>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Actor</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Target</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { time: '10 mins ago', actor: 'Sarah J. (Partner)', action: 'Generated Brief', target: 'Case #4021' },
                  { time: '25 mins ago', actor: 'System', action: 'Cache Cleanup', target: 'Vector DB' },
                  { time: '1 hour ago', actor: 'Mike R. (Associate)', action: 'Failed Login', target: 'Auth' },
                  { time: '2 hours ago', actor: 'Elena D. (Admin)', action: 'Updated Policy', target: 'Model Whitelist' },
                  { time: '3 hours ago', actor: 'John D. (Associate)', action: 'Document Analysis', target: 'Contract_v2.pdf' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium whitespace-nowrap text-muted-foreground flex items-center gap-2">
                      <Clock className="w-3 h-3" /> {row.time}
                    </td>
                    <td className="px-6 py-4">{row.actor}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        row.action === 'Failed Login' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      )}>{row.action}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{row.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">System Alerts</h3>
          </div>
          <div className="divide-y divide-border">
            {[
              { type: 'critical', msg: 'Provider "OpenAI" latency spike (>2s)', time: '2m ago' },
              { type: 'warning', msg: 'User quota exceeded for Org "Davis & Partners"', time: '15m ago' },
              { type: 'info', msg: 'Scheduled maintenance in 24h', time: '1h ago' },
              { type: 'warning', msg: 'High error rate in "Summary" agent', time: '3h ago' },
            ].map((alert, i) => (
              <div key={i} className="p-4 flex gap-4 hover:bg-muted/50">
                <div className="flex-shrink-0">
                  {alert.type === 'critical' ? <XCircle className="w-5 h-5 text-destructive" /> :
                   alert.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-500" /> :
                   <CheckCircle className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{alert.msg}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border">
             <button className="w-full text-center text-sm text-primary hover:underline">View all alerts</button>
          </div>
        </div>
      </div>
    </div>
  );
}
