'use client';

import { useState, useEffect } from 'react';

interface Stats {
  totalPatients: number;
  totalTherapists: number;
  activePackages: number;
  upcomingSessions: number;
  revenue: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    totalTherapists: 0,
    activePackages: 0,
    upcomingSessions: 0,
    revenue: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  // Simulated data fetch
  useEffect(() => {
    // In a real application, this would be an API call
    setStats({
      totalPatients: 150,
      totalTherapists: 25,
      activePackages: 85,
      upcomingSessions: 42,
      revenue: 25000,
    });

    setRecentActivity([
      {
        id: '1',
        type: 'session',
        description: 'New session booked with Dr. Smith',
        timestamp: '2024-02-20T10:30:00Z',
      },
      {
        id: '2',
        type: 'payment',
        description: 'Payment received for Premium Package',
        timestamp: '2024-02-20T09:15:00Z',
      },
      {
        id: '3',
        type: 'registration',
        description: 'New patient registration: John Doe',
        timestamp: '2024-02-20T08:45:00Z',
      },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Patients</h3>
          <p className="mt-2 text-3xl font-bold">{stats.totalPatients}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Therapists</h3>
          <p className="mt-2 text-3xl font-bold">{stats.totalTherapists}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Packages</h3>
          <p className="mt-2 text-3xl font-bold">{stats.activePackages}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Revenue (USD)</h3>
          <p className="mt-2 text-3xl font-bold">
            ${stats.revenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center p-3 border rounded-lg"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full mr-4 ${
                  activity.type === 'session'
                    ? 'bg-blue-100 text-blue-600'
                    : activity.type === 'payment'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-purple-100 text-purple-600'
                }`}
              >
                {activity.type === 'session'
                  ? '📅'
                  : activity.type === 'payment'
                  ? '💰'
                  : '👤'}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 