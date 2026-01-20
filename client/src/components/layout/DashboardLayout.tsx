'use client';

import Sidebar from './Sidebar';
import ProtectedRoute from '../ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <aside className="w-64 flex-shrink-0">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
