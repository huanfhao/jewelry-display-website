'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  Settings,
  Users,
  FileText
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/blog', label: 'Blog', icon: FileText },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/documents', label: 'Documents', icon: FileText },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 