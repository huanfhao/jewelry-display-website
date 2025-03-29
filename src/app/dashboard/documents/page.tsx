import { Metadata } from 'next'
import DocumentList from '@/components/documents/DocumentList'

export const metadata: Metadata = {
  title: 'Documents | Dashboard',
  description: 'View and manage your documents',
}

export default function DocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Documents</h1>
      <DocumentList />
    </div>
  )
} 