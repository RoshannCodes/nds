'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Users, Calendar, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, adminOnly: false },
    { name: 'Staff', href: '/staff', icon: Users, adminOnly: true },
    { name: 'Attendance', href: '/attendance', icon: Calendar, adminOnly: false },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-orange-600">StaffAttend</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          if (item.adminOnly && !isAdmin) return null;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="px-4 py-3 bg-gray-50 rounded-lg mb-3">
          <p className="text-xs font-medium text-gray-500">Signed in as</p>
          <p className="text-sm font-semibold text-gray-900 mt-1">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500 mt-1">{user?.role}</p>
        </div>

        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
