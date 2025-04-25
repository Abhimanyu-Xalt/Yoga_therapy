'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/patients', label: 'Patients', icon: '👥' },
  { href: '/dashboard/therapists', label: 'Therapists', icon: '👨‍⚕️' },
  { href: '/dashboard/packages', label: 'Packages', icon: '📦' },
  { href: '/dashboard/sessions', label: 'Sessions', icon: '📅' },
  { href: '/dashboard/feedback', label: 'Feedback', icon: '💬' },
  { href: '/dashboard/payments', label: 'Payments', icon: '💰' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-semibold">Yoga Therapy</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center p-3 rounded-lg hover:bg-gray-100 ${
                  pathname === item.href ? 'bg-gray-100' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300" />
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`p-4 ${
          isSidebarOpen ? 'lg:ml-64' : ''
        } transition-[margin]`}
      >
        {/* Mobile Header */}
        <div className="flex items-center mb-4 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 mr-2 rounded-lg hover:bg-gray-100"
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold">Yoga Therapy</h1>
        </div>

        {/* Page Content */}
        <main className="p-4 bg-white rounded-lg shadow">{children}</main>
      </div>
    </div>
  );
} 