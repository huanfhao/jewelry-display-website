import { Metadata } from 'next'
import SettingsForm from '@/components/settings/SettingsForm'

export const metadata: Metadata = {
  title: 'Settings | Dashboard',
  description: 'Manage your account settings and preferences',
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <SettingsForm />
    </div>
  )
} 