import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Page } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Organizations } from '@/components/pages/Organizations';
import { Users } from '@/components/pages/Users';
import { UsageCosts } from '@/components/pages/UsageCosts';
import { ModelPolicy } from '@/components/pages/ModelPolicy';
import { AuditLogs } from '@/components/pages/AuditLogs';
import { Security } from '@/components/pages/Security';

export function App() {
  const [currentPage, setPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'organizations':
        return <Organizations />;
      case 'users':
        return <Users />;
      case 'projects':
        // Placeholder for Projects
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-2xl font-bold text-foreground">Projects</h2>
            <p className="text-muted-foreground mt-2">Manage legal cases and document workspaces.</p>
            <div className="mt-6 p-6 border border-dashed border-border rounded-lg bg-muted/30">
              <p className="text-sm">No projects found. Create a new project to get started.</p>
            </div>
          </div>
        );
      case 'usage':
        return <UsageCosts />;
      case 'policy':
        return <ModelPolicy />;
      case 'audit':
        return <AuditLogs />;
      case 'security':
        return <Security />;
      case 'settings':
         return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-2xl font-bold text-foreground">Settings</h2>
            <p className="text-muted-foreground mt-2">Global application configuration.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} setPage={setPage}>
      {renderPage()}
    </Layout>
  );
}
