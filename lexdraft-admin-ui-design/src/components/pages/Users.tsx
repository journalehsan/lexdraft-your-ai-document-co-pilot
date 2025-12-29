import React from 'react';
import { MoreHorizontal, UserPlus, Search, Filter } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Users() {
  const users = [
    { id: 1, name: 'Harvey Specter', email: 'harvey@pearsonspecter.com', role: 'Admin', org: 'Pearson & Specter', lastActive: '2 mins ago', status: 'Active' },
    { id: 2, name: 'Mike Ross', email: 'mike@pearsonspecter.com', role: 'Editor', org: 'Pearson & Specter', lastActive: '1 hour ago', status: 'Active' },
    { id: 3, name: 'Louis Litt', email: 'louis@pearsonspecter.com', role: 'Viewer', org: 'Pearson & Specter', lastActive: '5 hours ago', status: 'Active' },
    { id: 4, name: 'Kim Wexler', email: 'kim@wexlermcgill.com', role: 'Admin', org: 'Wexler McGill', lastActive: '1 day ago', status: 'Active' },
    { id: 5, name: 'Chuck McGill', email: 'chuck@hhmm.com', role: 'Editor', org: 'Hamlin, Hamlin & McGill', lastActive: '3 days ago', status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage user access and roles across organizations.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium text-sm self-start sm:self-auto">
          <UserPlus className="w-4 h-4" /> Invite User
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search users..."
            className="pl-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
         <button className="flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-muted rounded-lg font-medium text-sm">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Organization</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Last Active</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.org}</td>
                  <td className="px-6 py-4">
                     <span className="px-2 py-1 bg-accent rounded-md text-xs font-medium text-accent-foreground">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.lastActive}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      user.status === 'Active' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    )}>
                      {user.status}
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
      </div>
    </div>
  );
}
