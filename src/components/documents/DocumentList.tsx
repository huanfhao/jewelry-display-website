'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function DocumentList() {
  const { data: session } = useSession()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function uploadDocument(file: File) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload document')

      const newDocument = await response.json()
      setDocuments(prev => [...prev, newDocument])
      toast.success('Document uploaded successfully')
    } catch (error) {
      console.error('Document upload error:', error)
      toast.error('Failed to upload document')
    }
  }

  if (!session) {
    return (
      <div className="text-center py-8">
        Please sign in to view your documents
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        Loading documents...
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) uploadDocument(file)
          }}
          className="hidden"
          id="document-upload"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <label
          htmlFor="document-upload"
          className="inline-block px-4 py-2 bg-primary text-white rounded cursor-pointer hover:bg-primary-dark"
        >
          Upload Document
        </label>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No documents found
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="p-4 border rounded flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium">{doc.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                  doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </span>
                <button
                  onClick={() => {
                    // 下载文档
                  }}
                  className="text-primary hover:text-primary-dark"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 