'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Inquiry {
  id: string;
  productName: string;
  customerName: string;
  createdAt: string;
  status: 'pending' | 'responded' | 'closed';
}

export function RecentInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const response = await fetch('/api/inquiries/recent');
        if (response.ok) {
          const data = await response.json();
          setInquiries(data);
        }
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInquiries();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Inquiries</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
        <Link
          href="/dashboard/inquiries"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {inquiries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent inquiries</p>
        ) : (
          inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{inquiry.productName}</p>
                  <p className="text-sm text-gray-500">from {inquiry.customerName}</p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      inquiry.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : inquiry.status === 'responded'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 