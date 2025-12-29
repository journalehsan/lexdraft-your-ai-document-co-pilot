import React from 'react';
import { Users, FolderKanban, Building2, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
}

function KPICard({ title, value, change, icon: Icon, trend }: KPICardProps) {
  const trendIcon = trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> :
                     trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> :
                     null;

  return (
    <div className="p-6 bg-card border border-border rounded-lg shadow-sm admin-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-secondary rounded-full text-primary">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full kpi-badge trend-${trend} flex items-center gap-1`}>
          {trendIcon} {change}
        </span>
      </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Users" value="—" change="+12%" icon={Users} trend="up" />
        <KPICard title="Active Projects" value="—" change="+8%" icon={FolderKanban} trend="up" />
        <KPICard title="Organizations" value="—" change="+5%" icon={Building2} trend="up" />
        <KPICard title="Active Sessions" value="—" change="+3%" icon={Clock} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg shadow-sm overflow-hidden admin-card">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left admin-table">
              <thead>
                <tr>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Actor</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Target</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-6 py-4 text-muted-foreground">10 mins ago</td>
                  <td className="px-6 py-4">System</td>
                  <td className="px-6 py-4">
                    <span className="action-badge info">User Created</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">user@example.com</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-6 py-4 text-muted-foreground">25 mins ago</td>
                  <td className="px-6 py-4">Admin</td>
                  <td className="px-6 py-4">
                    <span className="action-badge info">Role Updated</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">Editor</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-6 py-4 text-muted-foreground">1 hour ago</td>
                  <td className="px-6 py-4">User</td>
                  <td className="px-6 py-4">
                    <span className="action-badge error">Login Failed</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">user@domain.com</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden h-fit admin-card">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">System Status</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database</span>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Server</span>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Auth Service</span>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email Service</span>
                <span className="text-sm font-medium text-yellow-600">Degraded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
