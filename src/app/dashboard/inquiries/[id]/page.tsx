'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, DollarSign, Edit, Mail, MessageSquare, Phone, Tag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

interface InquiryData {
  id: string;
  quantity: number;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    description: string | null;
    images: string[];
    price: number;
    material: string | null;
    minOrderQuantity: number;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
    companyName: string | null;
    industry: string | null;
    position: string | null;
    address: string | null;
    country: string | null;
    createdAt: string;
  };
  quotation: {
    id: string;
    price: number;
    validUntil: string;
    terms: string;
    status: string;
    createdAt: string;
  } | null;
}

interface QuotationFormData {
  price: number;
  validUntil: string;
  terms: string;
}

export default function InquiryDetail() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [inquiry, setInquiry] = useState<InquiryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [submitting, setSubmitting] = useState(false);
  
  // 报价表单状态
  const [quotationForm, setQuotationForm] = useState<QuotationFormData>({
    price: 0,
    validUntil: '',
    terms: ''
  });
  
  // 状态更新表单
  const [statusForm, setStatusForm] = useState<{ status: string }>({
    status: ''
  });

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const fetchInquiry = async () => {
      try {
        const response = await fetch(`/api/inquiries/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch inquiry');
        }
        const data = await response.json();
        setInquiry(data);
        // 设置默认表单值
        if (data.quotation) {
          // 如果有报价，预填报价信息
          setQuotationForm({
            price: data.quotation.price,
            validUntil: new Date(data.quotation.validUntil).toISOString().split('T')[0],
            terms: data.quotation.terms
          });
        } else {
          // 设置默认报价信息
          const twoWeeksLater = new Date();
          twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
          setQuotationForm({
            price: data.product.price * data.quantity,
            validUntil: twoWeeksLater.toISOString().split('T')[0],
            terms: `This quotation is valid until ${format(twoWeeksLater, 'PPP')}. Terms and conditions apply.`
          });
        }
        setStatusForm({ status: data.status });
      } catch (err) {
        setError('Failed to load inquiry details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [params.id, router, session]);

  const handleQuotationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuotationForm(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusForm({ status: e.target.value });
  };

  // 提交报价
  const submitQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inquiry) return;
    
    setSubmitting(true);
    try {
      const endpoint = inquiry.quotation 
        ? `/api/quotations/${inquiry.quotation.id}`
        : '/api/quotations';
      
      const method = inquiry.quotation ? 'PATCH' : 'POST';
      
      const body = inquiry.quotation
        ? quotationForm
        : { ...quotationForm, inquiryId: inquiry.id };
        
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quotation');
      }

      toast({
        title: inquiry.quotation ? 'Quotation updated' : 'Quotation sent',
        description: inquiry.quotation 
          ? 'The quotation has been updated successfully'
          : 'The quotation has been sent to the customer',
      });
      
      // 重新加载询盘数据
      router.refresh();
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit quotation',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 更新询盘状态
  const updateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inquiry) return;
    
    setSubmitting(true);
    try {
      const response = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast({
        title: 'Status updated',
        description: `Inquiry status has been updated to ${statusForm.status}`,
      });
      
      // 重新加载询盘数据
      router.refresh();
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[70vh]">Loading inquiry details...</div>;
  }

  if (error || !inquiry) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="mb-4">{error || 'Failed to load inquiry'}</p>
        <Button onClick={() => router.push('/dashboard/inquiries')}>
          Back to Inquiries
        </Button>
      </div>
    );
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

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/inquiries" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Inquiry Details</h1>
          <p className="text-muted-foreground">
            Inquiry from {inquiry.user.name || inquiry.user.email} for {inquiry.product.name}
          </p>
        </div>
        <div className="ml-auto">
          {getStatusBadge(inquiry.status)}
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="details">Inquiry Details</TabsTrigger>
          <TabsTrigger value="quotation">
            {inquiry.quotation ? 'Edit Quotation' : 'Create Quotation'}
          </TabsTrigger>
          <TabsTrigger value="customer">Customer Info</TabsTrigger>
        </TabsList>

        {/* 询盘详情 */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Details about the inquired product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded overflow-hidden flex-shrink-0">
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
                  <div>
                    <h3 className="font-medium text-lg">{inquiry.product.name}</h3>
                    <div className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>${inquiry.product.price.toFixed(2)} per unit</span>
                    </div>
                    {inquiry.product.material && (
                      <div className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{inquiry.product.material}</span>
                      </div>
                    )}
                    <Link href={`/dashboard/products/${inquiry.product.id}`} className="text-primary text-sm mt-2 block">
                      View Product
                    </Link>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Inquiry Details</h4>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-md">
                    <div>
                      <span className="text-xs text-gray-500">Quantity</span>
                      <p className="font-medium">{inquiry.quantity}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Total Value</span>
                      <p className="font-medium">
                        ${(inquiry.product.price * inquiry.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Date</span>
                      <p className="font-medium">{format(new Date(inquiry.createdAt), 'PPP')}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Status</span>
                      <p className="font-medium">{inquiry.status}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inquiry Message</CardTitle>
                <CardDescription>Customer's original message</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-md relative">
                  <MessageSquare className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
                  <div className="pl-7 whitespace-pre-wrap">
                    {inquiry.message}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 状态更新 */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
              <CardDescription>Change the status of this inquiry</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateStatus} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="status">Status</Label>
                  <select 
                    id="status" 
                    name="status" 
                    value={statusForm.status}
                    onChange={handleStatusChange}
                    className="w-full border rounded-md px-3 py-2 mt-1"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="QUOTED">Quoted</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Status'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 如果有报价，显示报价详情 */}
          {inquiry.quotation && (
            <Card>
              <CardHeader>
                <CardTitle>Quotation Details</CardTitle>
                <CardDescription>Current quotation for this inquiry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-gray-500">Price</span>
                        <p className="font-medium">${inquiry.quotation.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Valid Until</span>
                        <p className="font-medium">{format(new Date(inquiry.quotation.validUntil), 'PPP')}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Status</span>
                        <p className="font-medium">{inquiry.quotation.status}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Created</span>
                        <p className="font-medium">{format(new Date(inquiry.quotation.createdAt), 'PPP')}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Terms and Conditions</h4>
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      {inquiry.quotation.terms}
                    </div>
                  </div>
                </div>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => setActiveTab('quotation')}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Quotation
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 报价表单 */}
        <TabsContent value="quotation">
          <Card>
            <CardHeader>
              <CardTitle>
                {inquiry.quotation ? 'Edit Quotation' : 'Create New Quotation'}
              </CardTitle>
              <CardDescription>
                {inquiry.quotation 
                  ? 'Update the existing quotation for this inquiry'
                  : 'Create a new quotation based on this inquiry'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitQuotation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (Total)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="pl-9"
                        value={quotationForm.price}
                        onChange={handleQuotationFormChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <Input
                        id="validUntil"
                        name="validUntil"
                        type="date"
                        className="pl-9"
                        value={quotationForm.validUntil}
                        onChange={handleQuotationFormChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms and Conditions</Label>
                  <Textarea
                    id="terms"
                    name="terms"
                    rows={5}
                    value={quotationForm.terms}
                    onChange={handleQuotationFormChange}
                    required
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab('details')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : (inquiry.quotation ? 'Update Quotation' : 'Send Quotation')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 客户信息 */}
        <TabsContent value="customer">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Details about the customer who made this inquiry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="bg-gray-50 p-4 rounded-md flex-1">
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    Contact Information
                  </h3>
                  <dl className="space-y-2">
                    <div className="grid grid-cols-3">
                      <dt className="text-gray-500 text-sm">Name</dt>
                      <dd className="col-span-2">{inquiry.user.name || 'N/A'}</dd>
                    </div>
                    <div className="grid grid-cols-3">
                      <dt className="text-gray-500 text-sm">Email</dt>
                      <dd className="col-span-2 flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-1 text-gray-500" />
                        <a href={`mailto:${inquiry.user.email}`} className="text-primary">
                          {inquiry.user.email}
                        </a>
                      </dd>
                    </div>
                    {inquiry.user.position && (
                      <div className="grid grid-cols-3">
                        <dt className="text-gray-500 text-sm">Position</dt>
                        <dd className="col-span-2">{inquiry.user.position}</dd>
                      </div>
                    )}
                    <div className="grid grid-cols-3">
                      <dt className="text-gray-500 text-sm">Customer Since</dt>
                      <dd className="col-span-2 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-gray-500" />
                        {format(new Date(inquiry.user.createdAt), 'PPP')}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-gray-50 p-4 rounded-md flex-1">
                  <h3 className="text-sm font-medium mb-3">Company Information</h3>
                  <dl className="space-y-2">
                    <div className="grid grid-cols-3">
                      <dt className="text-gray-500 text-sm">Company</dt>
                      <dd className="col-span-2">{inquiry.user.companyName || 'N/A'}</dd>
                    </div>
                    <div className="grid grid-cols-3">
                      <dt className="text-gray-500 text-sm">Industry</dt>
                      <dd className="col-span-2">{inquiry.user.industry || 'N/A'}</dd>
                    </div>
                    <div className="grid grid-cols-3">
                      <dt className="text-gray-500 text-sm">Country</dt>
                      <dd className="col-span-2">{inquiry.user.country || 'N/A'}</dd>
                    </div>
                    <div className="grid grid-cols-3">
                      <dt className="text-gray-500 text-sm">Address</dt>
                      <dd className="col-span-2">{inquiry.user.address || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href={`/dashboard/customers/${inquiry.user.id}`}>
                  <Button variant="outline">
                    View Customer Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 