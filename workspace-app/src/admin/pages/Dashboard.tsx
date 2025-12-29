import React from 'react';
import { Users, Zap, Coins, HardDrive, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

function KPICard({ title, value, change, icon: Icon, trend }: { title: string, value: string, change: string, icon: any, trend: 'up' | 'down' | 'neutral' }) {
  const getTrendColors = () => {
    switch (trend) {
      case 'up': return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30';
      case 'down': return 'from-rose-500/20 to-red-500/20 border-rose-500/30';
      default: return 'from-slate-500/20 to-gray-500/20 border-slate-500/30';
    }
  };

  const getIconColors = () => {
    switch (trend) {
      case 'up': return 'text-emerald-500 bg-emerald-500/10';
      case 'down': return 'text-rose-500 bg-rose-500/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  return (
    <div className={`relative p-6 rounded-xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 admin-card 
      bg-gradient-to-br ${getTrendColors()} hover:border-opacity-80 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground/80 tracking-wide">{title}</h3>
        </div>
        <div className={`p-3 rounded-full ${getIconColors()} transition-all duration-300 hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-foreground tracking-tight">{value}</span>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full kpi-badge trend-${trend} 
          transition-all duration-300 hover:scale-105`}>
          {change}
        </span>
      </div>
      {/* Subtle decorative element */}
      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of system metrics and recent activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Active Users" value="1,284" change="+12%" icon={Users} trend="up" />
        <KPICard title="Agent Runs (Today)" value="4,392" change="+8%" icon={Zap} trend="up" />
        <KPICard title="Token Spend (MTD)" value="$12,450" change="-2%" icon={Coins} trend="down" />
        <KPICard title="System Health" value="98%" change="+1%" icon={CheckCircle} trend="up" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Cache Savings" value="$3,100" change="+15%" icon={HardDrive} trend="up" />
        <KPICard title="API Uptime" value="99.8%" change="+0.1%" icon={Clock} trend="up" />
        <KPICard title="Storage Used" value="45%" change="+2%" icon={HardDrive} trend="neutral" />
        <KPICard title="Support Tickets" value="12" change="-3" icon={Users} trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-border/50 rounded-xl shadow-lg overflow-hidden admin-card dashboard-card hover:shadow-xl transition-all duration-300">
          <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center">
            <h3 className="font-semibold text-foreground tracking-tight">Recent Activity</h3>
            <button className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left admin-table">
              <thead className="text-xs text-muted-foreground uppercase bg-gradient-to-r from-muted/50 to-transparent">
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
                  <tr key={i} className="border-b border-border/30 hover:bg-gradient-to-r hover:from-muted/50 hover:to-transparent transition-all duration-200">
                    <td className="px-6 py-4 font-medium whitespace-nowrap text-muted-foreground/80 flex items-center gap-2">
                      <Clock className="w-3 h-3 opacity-70" /> {row.time}
                    </td>
                    <td className="px-6 py-4">{row.actor}</td>
                    <td className="px-6 py-4">
                      <span className={`action-badge ${row.action === 'Failed Login' ? 'error' : 'info'} transition-all duration-200 hover:scale-105`}>
                        {row.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{row.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-border/50 rounded-xl shadow-lg overflow-hidden h-fit admin-card dashboard-card hover:shadow-xl transition-all duration-300">
          <div className="px-6 py-4 border-b border-border/50">
            <h3 className="font-semibold text-foreground tracking-tight">System Alerts</h3>
          </div>
          <div className="divide-y divide-border/30">
            {[
              { type: 'critical', msg: 'Provider "OpenAI" latency spike (>2s)', time: '2m ago' },
              { type: 'warning', msg: 'User quota exceeded for Org "Davis & Partners"', time: '15m ago' },
              { type: 'info', msg: 'Scheduled maintenance in 24h', time: '1h ago' },
              { type: 'warning', msg: 'High error rate in "Summary" agent', time: '3h ago' },
            ].map((alert, i) => (
              <div key={i} className="p-4 flex gap-4 hover:bg-gradient-to-r hover:from-muted/50 hover:to-transparent transition-all duration-200">
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
          <div className="p-4 border-t border-border/50">
             <button className="w-full text-center text-sm text-primary hover:text-primary/80 hover:underline transition-colors">View all alerts</button>
          </div>
        </div>
      </div>
    </div>
  );
}
