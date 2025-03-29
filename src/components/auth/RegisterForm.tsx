'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  companyName: z.string().min(2, 'Please enter your company name'),
  companySize: z.string().min(1, 'Please select company size'),
  industry: z.string().min(1, 'Please select industry'),
  position: z.string().min(2, 'Please enter your position'),
  address: z.string().min(5, 'Please enter detailed address'),
  country: z.string().min(1, 'Please select country/region'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      toast.success('Registration successful!');
      router.push('/auth/signin');
    } catch (error) {
      toast.error('Registration failed, please try again');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email Address</label>
        <input
          type="email"
          {...register('email')}
          className="w-full p-2 border rounded"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          {...register('password')}
          className="w-full p-2 border rounded"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Company Name</label>
        <input
          type="text"
          {...register('companyName')}
          className="w-full p-2 border rounded"
          disabled={isLoading}
        />
        {errors.companyName && (
          <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Company Size</label>
        <select
          {...register('companySize')}
          className="w-full p-2 border rounded"
          disabled={isLoading}
        >
          <option value="">Please select</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-500">201-500 employees</option>
          <option value="501+">501+ employees</option>
        </select>
        {errors.companySize && (
          <p className="text-red-500 text-sm mt-1">{errors.companySize.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Industry</label>
        <select
          {...register('industry')}
          className="w-full p-2 border rounded"
          disabled={isLoading}
        >
          <option value="">Please select</option>
          <option value="jewelry">Jewelry</option>
          <option value="fashion">Fashion</option>
          <option value="accessories">Accessories</option>
          <option value="other">Other</option>
        </select>
        {errors.industry && (
          <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Position</label>
        <input
          type="text"
          {...register('position')}
          className="w-full p-2 border rounded"
          disabled={isLoading}
        />
        {errors.position && (
          <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          type="text"
          {...register('address')}
          className="w-full p-2 border rounded"
          disabled={isLoading}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Country/Region</label>
        <select
          {...register('country')}
          className="w-full p-2 border rounded"
          disabled={isLoading}
        >
          <option value="">Please select</option>
          <option value="CN">China</option>
          <option value="US">United States</option>
          <option value="JP">Japan</option>
          <option value="KR">South Korea</option>
          <option value="OTHER">Other</option>
        </select>
        {errors.country && (
          <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
} 