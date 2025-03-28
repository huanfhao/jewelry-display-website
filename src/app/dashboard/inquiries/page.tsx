import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';
import { 
  Eye, 
  FileText, 
  Filter, 
  Search 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Inquiries | Dashboard',
  description: 'Manage customer inquiries',
};

interface Inquiry {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: string;
    name: string;
    images: string[];
    price: number;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
    companyName: string | null;
  };
  quotation: {
    id: string;
    price: number;
    validUntil: Date;
    status: string;
  } | null;
}

async function getInquiries(status?: string, page: number = 1) {
  const where = status ? { status } : {};
  const limit = 10;
  const skip = (page - 1) * limit;

  const inquiries = await prisma.inquiry.findMany({
    where,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          images: true,
          price: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          companyName: true,
        },
      },
      quotation: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip,
  });

  const total = await prisma.inquiry.count({ where });

  return {
    inquiries,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      current: page,
    },
  };
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'PENDING':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    case 'QUOTED':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Quoted</Badge>;
    case 'ACCEPTED':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Accepted</Badge>;
    case 'REJECTED':
      return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
  }
}

async function InquiriesContent({ searchParams }: { searchParams: { status?: string; page?: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  const status = searchParams.status;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  
  const { inquiries, pagination } = await getInquiries(status, page);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inquiries</h1>
          <p className="text-muted-foreground">Manage and respond to customer inquiries</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filter Inquiries</CardTitle>
          <CardDescription>Search and filter inquiries by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border rounded-md px-3 py-2 flex-1">
              <Search className="w-4 h-4 mr-2 text-muted-foreground" />
              <input
                placeholder="Search by product or customer..."
                className="flex-1 bg-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/inquiries" className={`px-3 py-2 rounded-md border ${!status ? 'bg-primary text-white border-primary' : ''}`}>
                All
              </Link>
              <Link href="/dashboard/inquiries?status=PENDING" className={`px-3 py-2 rounded-md border ${status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}`}>
                Pending
              </Link>
              <Link href="/dashboard/inquiries?status=QUOTED" className={`px-3 py-2 rounded-md border ${status === 'QUOTED' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}`}>
                Quoted
              </Link>
              <Link href="/dashboard/inquiries?status=ACCEPTED" className={`px-3 py-2 rounded-md border ${status === 'ACCEPTED' ? 'bg-green-100 text-green-800 border-green-200' : ''}`}>
                Accepted
              </Link>
              <Link href="/dashboard/inquiries?status=REJECTED" className={`px-3 py-2 rounded-md border ${status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-200' : ''}`}>
                Rejected
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {inquiries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No inquiries found</h3>
          <p className="text-gray-500">There are no inquiries matching your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className="overflow-hidden">
              <div className="p-6 flex flex-col md:flex-row gap-6">
                {/* 产品信息 */}
                <div className="flex gap-4">
                  <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    {inquiry.product.images && inquiry.product.images[0] ? (
                      <Image
                        src={inquiry.product.images[0]}
                        alt={inquiry.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{inquiry.product.name}</h3>
                    <p className="text-gray-500 text-sm">Price: ${inquiry.product.price.toFixed(2)}</p>
                    <p className="text-gray-500 text-sm">Quantity: {inquiry.quantity}</p>
                  </div>
                </div>

                {/* 客户信息 */}
                <div className="md:ml-auto md:mr-auto">
                  <h4 className="text-sm font-medium text-gray-700">Customer</h4>
                  <p className="text-gray-900">{inquiry.user.name || 'Unknown'}</p>
                  <p className="text-gray-500 text-sm">{inquiry.user.email}</p>
                  {inquiry.user.companyName && (
                    <p className="text-gray-500 text-sm">{inquiry.user.companyName}</p>
                  )}
                </div>

                {/* 状态和日期 */}
                <div>
                  <div className="flex flex-col items-start md:items-end mb-2">
                    {getStatusBadge(inquiry.status)}
                    <span className="text-gray-500 text-xs mt-1">
                      {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link href={`/dashboard/inquiries/${inquiry.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 分页 */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-1">
            {[...Array(pagination.pages)].map((_, i) => {
              const pageNum = i + 1;
              const url = new URL(typeof window !== 'undefined' ? window.location.href : 'http://localhost');
              url.searchParams.set('page', pageNum.toString());
              if (status) url.searchParams.set('status', status);
              return (
                <Link
                  key={pageNum}
                  href={url.pathname + url.search}
                  className={`px-3 py-2 rounded-md ${
                    pageNum === pagination.current
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InquiriesPage({ searchParams }: { searchParams: { status?: string; page?: string } }) {
  return (
    <Suspense fallback={<div>Loading inquiries...</div>}>
      <InquiriesContent searchParams={searchParams} />
    </Suspense>
  );
} 