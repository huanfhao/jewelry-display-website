import { prisma } from '@/lib/prisma'
import AdminMessagesClient from './page.client'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  try {
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

    // 序列化日期
    const serializedData = {
      messages: messages.map(msg => ({
        ...msg,
        createdAt: msg.createdAt.toISOString(),
        updatedAt: msg.updatedAt.toISOString()
      })),
      comments: comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString()
      })),
      metrics: metrics.map(metric => ({
        ...metric,
        createdAt: metric.createdAt.toISOString()
      }))
    }

    return (
      <AdminMessagesClient 
        initialMessages={serializedData.messages}
        initialComments={serializedData.comments}
        initialMetrics={serializedData.metrics}
      />
    )
  } catch (error) {
    console.error('Error loading admin messages:', error)
    return <div>Error loading data. Please try again later.</div>
  }
} 