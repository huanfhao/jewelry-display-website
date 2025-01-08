'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react'

interface Address {
  id: string
  name: string
  phone: string
  address: string
  isDefault: boolean
}

interface AddressListProps {
  addresses: Address[]
  onAdd: () => void
  onEdit: (address: Address) => void
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}

export default function AddressList({
  addresses,
  onAdd,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Addresses Yet</h3>
        <p className="text-gray-500 mb-6">
          Add your first shipping address to make checkout easier.
        </p>
        <button
          onClick={onAdd}
          className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-900 transition-colors"
        >
          Add Address
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Shipping Addresses</h3>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 text-sm hover:text-gray-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 rounded-lg border ${
                address.isDefault ? 'border-black' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{address.name}</span>
                    {address.isDefault && (
                      <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{address.phone}</div>
                  <div className="text-sm text-gray-600 mt-2">{address.address}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(address)}
                    className="p-2 text-gray-500 hover:text-black transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(address.id)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!address.isDefault && (
                <button
                  onClick={() => onSetDefault(address.id)}
                  className="mt-4 text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
} 