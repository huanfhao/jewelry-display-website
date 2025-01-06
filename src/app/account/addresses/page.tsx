'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AddressForm from '@/components/address/AddressForm';

interface Address {
  id: string;
  name: string;
  phone: string;
  email: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault: boolean;
}

type AddressFormData = Omit<Address, 'id'>;

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    try {
      const response = await fetch('/api/addresses');
      if (!response.ok) {
        throw new Error('Failed to load addresses');
      }
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      setError('Failed to load addresses, please try again');
      console.error('Failed to load addresses:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: AddressFormData) {
    try {
      const response = await fetch(
        editingAddress ? `/api/addresses/${editingAddress.id}` : '/api/addresses',
        {
          method: editingAddress ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      setShowForm(false);
      setEditingAddress(null);
      loadAddresses();
    } catch (error) {
      throw new Error('Failed to save address, please try again');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      loadAddresses();
    } catch (error) {
      setError('Failed to delete address, please try again');
      console.error('Failed to delete address:', error);
    }
  }

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (showForm) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </h1>
        <AddressForm
          initialData={editingAddress ? {
            name: editingAddress.name,
            phone: editingAddress.phone,
            email: editingAddress.email,
            province: editingAddress.province,
            city: editingAddress.city,
            district: editingAddress.district,
            address: editingAddress.address,
            isDefault: editingAddress.isDefault,
          } : undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shipping Addresses</h1>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No shipping addresses added yet
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border rounded-lg p-4 relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-medium">{address.name}</span>
                    <span>{address.phone}</span>
                    {address.isDefault && (
                      <span className="text-xs text-primary border border-primary rounded px-2 py-0.5">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600">
                    {address.province} {address.city} {address.district}
                    <br />
                    {address.address}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingAddress(address);
                      setShowForm(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 