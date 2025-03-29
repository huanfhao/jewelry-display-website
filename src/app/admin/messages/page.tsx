import prisma from '@/lib/prisma'
import AdminMessagesClient from './page.client'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  try {
    const [messages, comments, metrics] = await Promise.all([
      // 获取联系消息
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      
      // 获取博客评论
      prisma.comment.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            select: {
              title: true
            }
          }
        }
      }),
      
      // 获取性能指标
      prisma.performanceMetric.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
      })
    ])

    // 计算统计数据
    const totalMessages = messages.length
    const readMessages = messages.filter(msg => msg.read).length
    const unreadMessages = totalMessages - readMessages

    // 序列化日期以便客户端使用
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
        label: metric.label || undefined,
        page: metric.page || undefined,
        createdAt: metric.createdAt.toISOString()
      }))
    }

    return (
      <div className="py-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 sr-only">管理员控制台 - 消息管理</h1>
          <AdminMessagesClient 
            initialMessages={serializedData.messages}
            initialComments={serializedData.comments}
            initialMetrics={serializedData.metrics}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading admin messages:', error)
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          <h2 className="text-lg font-medium mb-2">数据加载错误</h2>
          <p>无法加载消息数据。请稍后再试或联系技术支持。</p>
          <p className="text-sm mt-2 text-red-500">{(error as Error).message}</p>
        </div>
      </div>
    )
  }
} 