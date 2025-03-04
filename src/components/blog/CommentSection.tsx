'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface CommentFormData {
  author: string
  email: string
  content: string
}

interface Comment {
  id: string
  author: string
  content: string
  createdAt: Date
}

export default function CommentSection({ 
  postId, 
  comments: initialComments 
}: { 
  postId: string
  comments: Comment[]
}) {
  const [comments, setComments] = useState(initialComments)
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CommentFormData>()

  const onSubmit = async (data: CommentFormData) => {
    try {
      setError(null)
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, postId })
      })

      const result = await response.json()
      
      if (!response.ok) {
        setError(result.error || 'Failed to submit comment')
        return
      }

      setComments(prev => [result, ...prev])
      reset()
    } catch (error) {
      setError('Failed to submit comment')
      console.error('Error submitting comment:', error)
    }
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-playfair mb-8">Comments</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <input
              {...register('author', { required: 'Name is required' })}
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-500">{errors.author.message}</p>
            )}
          </div>
          <div>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div className="mb-6">
          <textarea
            {...register('content', { required: 'Comment is required' })}
            placeholder="Your Comment"
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>

      <div className="space-y-8">
        {comments.map(comment => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{comment.author}</h3>
              <time className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 