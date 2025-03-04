import { prisma } from '@/lib/prisma'
import AdminMessagesClient from './page.client'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  const [messages, metrics, comments] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    }),
    prisma.performanceMetric.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          select: {
            title: true
          }
        }
      }
    })
  ])

  return (
    <AdminMessagesClient 
      initialMessages={messages}
      initialComments={comments}
      initialMetrics={metrics}
    />
  )
} 