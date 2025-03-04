'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils'
import type { SerializedContactMessage, SerializedCommentWithPost, SerializedPerformanceMetric } from '@/types'

interface AdminMessagesClientProps {
  initialMessages: SerializedContactMessage[]
  initialComments: SerializedCommentWithPost[]
  initialMetrics: SerializedPerformanceMetric[]
}

export default function AdminMessagesClient({
  initialMessages,
  initialComments,
  initialMetrics
}: AdminMessagesClientProps) {
  const [messages, setMessages] = useState<SerializedContactMessage[]>(initialMessages)
  const [comments, setComments] = useState<SerializedCommentWithPost[]>(initialComments)
  const [metrics] = useState<SerializedPerformanceMetric[]>(initialMetrics)

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      })

      if (!response.ok) throw new Error('Failed to update message')

      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ))
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete message')

      setMessages(messages.filter(msg => msg.id !== id))
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete comment')

      setComments(comments.filter(comment => comment.id !== id))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Contact Messages Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.map((message) => (
                <tr key={message.id} className={message.read ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{message.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{message.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(message.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {!message.read && (
                      <button 
                        onClick={() => handleMarkAsRead(message.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteMessage(message.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Comments Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Blog Comments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comment.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.post.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{comment.content}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Performance Metrics Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Performance Metrics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.map((metric) => (
                <tr key={metric.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{metric.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{metric.value.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{metric.label || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{metric.page || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(metric.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
} 