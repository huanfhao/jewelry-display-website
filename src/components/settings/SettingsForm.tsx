'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'

const settingsSchema = z.object({
  language: z.enum(['en', 'zh']),
  theme: z.enum(['light', 'dark', 'system']),
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export default function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      language: 'en',
      theme: 'system',
      emailNotifications: true,
      marketingEmails: false,
    },
  })

  async function onSubmit(data: SettingsFormData) {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to update settings')
      
      toast.success('Settings updated successfully')
    } catch (error) {
      console.error('Settings update error:', error)
      toast.error('Failed to update settings')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Language
        </label>
        <select
          {...form.register('language')}
          className="w-full p-2 border rounded"
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Theme
        </label>
        <select
          {...form.register('theme')}
          className="w-full p-2 border rounded"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...form.register('emailNotifications')}
            className="rounded"
          />
          <span>Email Notifications</span>
        </label>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...form.register('marketingEmails')}
            className="rounded"
          />
          <span>Marketing Emails</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
} 