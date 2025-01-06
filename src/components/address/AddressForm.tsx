'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { useSession } from 'next-auth/react';

interface AddressFormData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault: boolean;
}

interface AddressFormProps {
  initialData?: AddressFormData;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
}

export default function AddressForm({
  initialData,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<AddressFormData>(
    initialData || {
      name: '',
      phone: '',
      email: session?.user?.email || '',
      province: '',
      city: '',
      district: '',
      address: '',
      isDefault: false,
    }
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Recipient Name
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Phone Number
          </label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="province" className="block text-sm font-medium mb-2">
            Province
          </label>
          <Input
            id="province"
            value={formData.province}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, province: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-2">
            City
          </label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-medium mb-2">
            District
          </label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, district: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-2">
          Detailed Address
        </label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isDefault: e.target.checked })}
          className="h-4 w-4 text-primary border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="ml-2 text-sm">
          Set as Default Address
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Address'}
        </Button>
      </div>
    </form>
  );
}