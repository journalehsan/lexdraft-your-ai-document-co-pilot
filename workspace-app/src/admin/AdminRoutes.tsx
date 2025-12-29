import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './layout/AdminLayout';
import { AdminGuard } from './components/AdminGuard';
import { Dashboard } from './pages/Dashboard';
import { UsersPage } from './pages/UsersPage';
import { RolesPage } from './pages/RolesPage';
import { PermissionsPage } from './pages/PermissionsPage';

export default function AdminRoutes() {
  return (
    <AdminGuard>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
        </Routes>
      </AdminLayout>
    </AdminGuard>
  );
}
