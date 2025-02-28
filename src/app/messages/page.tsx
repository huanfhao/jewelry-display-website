'use client'

import { useEffect, useState } from 'react'
import { ContactMessage } from '@/types'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

const ADMIN_PASSWORD = 'sy2024' // 您可以更改这个密码

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      fetchMessages()
    } else {
      toast.error('Invalid password')
    }
  }

  async function fetchMessages() {
    setLoading(true)
    try {
      const response = await fetch('/api/messages')
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkAsRead(id: string) {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })

      if (!response.ok) throw new Error('Failed to update message')
      
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ))
      toast.success('Message marked as read')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to update message')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this message?')) {
      return
    }

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete message')
      
      setMessages(messages.filter(msg => msg.id !== id))
      toast.success('Message deleted successfully')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to delete message')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                placeholder="Enter admin password"
              />
            </div>
            <Button type="submit" className="w-full h-12">
              Login
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <Button 
          variant="outline"
          onClick={() => setIsAuthenticated(false)}
        >
          Logout
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="p-4 text-center">No messages found</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-4 ${message.read ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{message.name}</h3>
                    <p className="text-sm text-gray-600">{message.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {!message.read && message.id && (
                      <button
                        onClick={() => handleMarkAsRead(message.id!)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(message.id!)}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{message.message}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {new Date(message.createdAt!).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 