'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const inquirySchema = z.object({
  quantity: z.number().min(1, '请输入有效的数量'),
  message: z.string().min(10, '请详细描述您的需求（至少10个字符）'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  productId: string;
}

export function InquiryForm({ productId }: InquiryFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (data: InquiryFormData) => {
    if (!session) {
      toast.error('请先登录');
      router.push('/auth/signin');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error('提交询盘失败');
      }

      toast.success('询盘已提交，我们会尽快与您联系！');
      router.push('/dashboard/inquiries');
    } catch (error) {
      toast.error('提交失败，请重试');
      console.error('Inquiry submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">采购数量</label>
        <input
          type="number"
          {...register('quantity', { valueAsNumber: true })}
          className="w-full p-2 border rounded"
          disabled={isLoading}
          min="1"
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">询盘详情</label>
        <textarea
          {...register('message')}
          className="w-full p-2 border rounded h-32"
          disabled={isLoading}
          placeholder="请详细描述您的具体需求，例如：定制要求、包装需求、付款条件等"
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? '提交中...' : '提交询盘'}
      </button>

      {!session && (
        <p className="text-sm text-gray-500 text-center">
          需要登录后才能提交询盘
        </p>
      )}
    </form>
  );
} 