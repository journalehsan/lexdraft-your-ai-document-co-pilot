import React from 'react';
import { ShieldAlert, Globe, Key, AlertTriangle, Trash2 } from 'lucide-react';

export function Security() {
  const failedLogins = [
    { ip: '192.168.1.105', location: 'Moscow, RU', time: '10 mins ago', user: 'admin', reason: 'Invalid Password' },
    { ip: '45.33.22.11', location: 'Beijing, CN', time: '2 hours ago', user: 'root', reason: 'Invalid User' },
    { ip: '10.0.0.55', location: 'New York, US', time: '5 hours ago', user: 'sarah.j', reason: 'MFA Failed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Security & Access Control</h1>
        <p className="text-muted-foreground">Monitor threats, manage sessions, and configure network security.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Failed Logins Panel */}
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-destructive" />
              Recent Failed Logins
            </h3>
            <span className="text-xs font-medium bg-destructive/10 text-destructive px-2 py-1 rounded-full">3 New</span>
          </div>
          <div className="divide-y divide-border">
            {failedLogins.map((login, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-full">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{login.ip} <span className="text-muted-foreground font-normal">({login.location})</span></p>
                    <p className="text-xs text-muted-foreground">{login.time} • User: {login.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded">{login.reason}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-muted/20 border-t border-border">
            <button className="text-sm text-primary hover:underline w-full text-center">View all security logs</button>
          </div>
        </div>

        {/* IP Allowlist Panel */}
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              IP Allowlist
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Only allow access to the admin panel from these IP addresses. Leave empty to allow all.
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input type="text" value="203.0.113.45" className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" readOnly />
                <button className="p-2 text-destructive hover:bg-destructive/10 rounded-md">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-2">
                <input type="text" value="198.51.100.0/24" className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" readOnly />
                <button className="p-2 text-destructive hover:bg-destructive/10 rounded-md">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-2 pt-2">
                <input type="text" placeholder="Enter IP address or CIDR" className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Sessions Revocation */}
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Active Admin Sessions
            </h3>
            <button className="text-xs font-medium text-destructive border border-destructive px-3 py-1 rounded hover:bg-destructive hover:text-destructive-foreground transition-colors">
              Revoke All Other Sessions
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted">
                <tr>
                  <th className="px-6 py-3">Device / Browser</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">IP Address</th>
                  <th className="px-6 py-3">Last Active</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-green-50/50 dark:bg-green-900/10">
                  <td className="px-6 py-4 font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Chrome on macOS (This Device)
                  </td>
                  <td className="px-6 py-4">San Francisco, US</td>
                  <td className="px-6 py-4">127.0.0.1</td>
                  <td className="px-6 py-4">Just now</td>
                  <td className="px-6 py-4 text-right text-muted-foreground text-xs italic">Current Session</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="px-6 py-4 font-medium">Safari on iOS</td>
                  <td className="px-6 py-4">San Francisco, US</td>
                  <td className="px-6 py-4">10.0.0.12</td>
                  <td className="px-6 py-4">2 days ago</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-destructive hover:underline text-xs font-medium">Revoke</button>
                  </td>
                </tr>
                 <tr className="hover:bg-muted/50">
                  <td className="px-6 py-4 font-medium">Firefox on Windows</td>
                  <td className="px-6 py-4">London, UK</td>
                  <td className="px-6 py-4">82.11.22.33</td>
                  <td className="px-6 py-4">1 week ago</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-destructive hover:underline text-xs font-medium">Revoke</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
