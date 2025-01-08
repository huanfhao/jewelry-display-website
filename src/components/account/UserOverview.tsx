'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Phone, MapPin, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EditProfileForm from './EditProfileForm'

interface UserOverviewProps {
  user: {
    name: string
    email: string
    createdAt: string
  }
}

export default function UserOverview({ user }: UserOverviewProps) {
  const [isEditing, setIsEditing] = useState(false);

  async function handleUpdateProfile(data: {
    name: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      // 刷新页面以显示更新后的信息
      window.location.reload();
    } catch (error) {
      throw error;
    }
  }

  if (isEditing) {
    return (
      <EditProfileForm
        initialData={{
          name: user.name,
          email: user.email,
        }}
        onSubmit={handleUpdateProfile}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-100 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center gap-6">
          {/* 用户头像 */}
          <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-10 h-10 text-gray-400" />
          </div>

          {/* 用户基本信息 */}
          <div className="flex-grow">
            <h2 className="text-2xl font-medium mb-2">{user.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* 编辑按钮 */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        </div>

        {/* 账户安全信息 */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-4">Account Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Last changed 3 months ago
                </p>
                <button 
                  className="text-sm text-primary hover:text-primary/80 mt-2"
                  onClick={() => setIsEditing(true)}
                >
                  Change Password
                </button>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Not enabled
                </p>
                <button className="text-sm text-primary hover:text-primary/80 mt-2">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 账户活动 */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Last login</span>
              </div>
              <span className="text-gray-500">Today, 10:30 AM</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Password changed</span>
              </div>
              <span className="text-gray-500">3 months ago</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Email verified</span>
              </div>
              <span className="text-gray-500">6 months ago</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 