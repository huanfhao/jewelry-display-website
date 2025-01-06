'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { AddToCartToast } from '@/components/ui/add-to-cart-toast';
import AddressForm from '@/components/address/AddressForm';

export default function PaymentPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [selectedMethod, setSelectedMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [addressData, setAddressData] = useState<any>(null);

  async function handleAddressSubmit(data: any) {
    setAddressData(data);
  }

  async function handleSubmit() {
    if (!addressData) {
      setToastMessage('请填写收货地址');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: selectedMethod,
          name: addressData.name,
          phone: addressData.phone,
          email: addressData.email,
          address: `${addressData.province}${addressData.city}${addressData.district}${addressData.address}`,
          note: addressData.note,
        }),
      });

      if (!response.ok) {
        throw new Error('创建订单失败');
      }

      const data = await response.json();
      router.push(`/orders/${data.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      setToastMessage('创建订单失败');
      setToastType('error');
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">填写订单信息</h1>

      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">收货信息</h2>
          <AddressForm
            onSubmit={handleAddressSubmit}
            onCancel={() => {}}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">选择支付方式</h2>
          <div className="space-y-4">
            <label className="block p-4 border rounded-lg cursor-pointer hover:border-primary">
              <input
                type="radio"
                name="payment"
                value="wechat"
                checked={selectedMethod === 'wechat'}
                onChange={(e) => setSelectedMethod('wechat')}
                className="mr-2"
              />
              微信支付
            </label>

            <label className="block p-4 border rounded-lg cursor-pointer hover:border-primary">
              <input
                type="radio"
                name="payment"
                value="alipay"
                checked={selectedMethod === 'alipay'}
                onChange={(e) => setSelectedMethod('alipay')}
                className="mr-2"
              />
              支付宝
            </label>

            <Button
              className="w-full mt-6"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : (
                '提交订单'
              )}
            </Button>
          </div>
        </Card>
      </div>

      <AddToCartToast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
      />
    </div>
  );
} 