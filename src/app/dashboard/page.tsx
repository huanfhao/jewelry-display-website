import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentInquiries } from '@/components/dashboard/RecentInquiries';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to your dashboard. Here's what's happening with your business today.
        </p>
      </div>

      <DashboardStats />

      <div className="md:grid-cols-1 grid gap-8">
        <RecentInquiries />
      </div>
    </div>
  );
} 