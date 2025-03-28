'use client';

import { useEffect, useState } from 'react';
import { 
  Package, 
  MessageSquare, 
  Users
} from 'lucide-react';

interface Stats {
  products: number;
  inquiries: number;
  customers: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    inquiries: 0,
    customers: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, []);

  const statItems = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { label: 'Total Inquiries', value: stats.inquiries, icon: MessageSquare, color: 'bg-green-500' },
    { label: 'Total Customers', value: stats.customers, icon: Users, color: 'bg-purple-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white rounded-lg shadow p-6 flex items-center"
          >
            <div className={`${item.color} p-3 rounded-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
} 