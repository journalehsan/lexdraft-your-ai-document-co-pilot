import React from 'react';
import { MoreHorizontal, Building2, Download } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Organizations() {
  const orgs = [
    { id: 1, name: 'Pearson & Specter', plan: 'Enterprise', users: 145, created: 'Jan 12, 2023', status: 'Active' },
    { id: 2, name: 'Hamlin, Hamlin & McGill', plan: 'Pro', users: 42, created: 'Mar 04, 2023', status: 'Active' },
    { id: 3, name: 'Schweikart & Cokely', plan: 'Enterprise', users: 89, created: 'Jun 22, 2023', status: 'Suspended' },
    { id: 4, name: 'Wexler McGill', plan: 'Starter', users: 12, created: 'Aug 15, 2023', status: 'Active' },
    { id: 5, name: 'Davis & Main', plan: 'Pro', users: 56, created: 'Sep 09, 2023', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Organizations</h1>
          <p className="text-muted-foreground">Manage client law firms and their subscription status.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 font-medium text-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium text-sm">
            <Building2 className="w-4 h-4" /> Add Organization
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted">
              <tr>
                <th className="px-6 py-3">Organization Name</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Users</th>
                <th className="px-6 py-3">Created On</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orgs.map((org) => (
                <tr key={org.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{org.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-accent rounded-md text-xs font-medium text-accent-foreground">
                      {org.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{org.users}</td>
                  <td className="px-6 py-4 text-muted-foreground">{org.created}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      org.status === 'Active' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    )}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-between items-center text-xs text-muted-foreground">
          <span>Showing 1-5 of 12 organizations</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-input rounded hover:bg-muted" disabled>Previous</button>
            <button className="px-3 py-1 border border-input rounded hover:bg-muted">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
