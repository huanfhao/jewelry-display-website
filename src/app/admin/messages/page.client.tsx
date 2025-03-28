'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils'
import type { SerializedContactMessage, SerializedCommentWithPost, SerializedPerformanceMetric } from '@/types/index'
import { Calendar, Filter, CheckCircle, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

// 简单实现Select组件
interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

function Select({ value, onValueChange, children }: SelectProps) {
  return (
    <div className="relative">
      <select 
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-[140px] appearance-none pr-8"
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronLeft className="h-4 w-4 rotate-90" />
      </div>
    </div>
  )
}

function SelectTrigger({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function SelectItem({ value, children }: { value: string, children: React.ReactNode }) {
  return <option value={value}>{children}</option>
}

function SelectValue({ placeholder }: { placeholder: string }) {
  return <span>{placeholder}</span>
}

interface AdminMessagesClientProps {
  initialMessages: SerializedContactMessage[]
  initialComments: SerializedCommentWithPost[]
  initialMetrics: SerializedPerformanceMetric[]
}

// 每页显示的消息数量
const ITEMS_PER_PAGE = 10;

export default function AdminMessagesClient({
  initialMessages,
  initialComments,
  initialMetrics
}: AdminMessagesClientProps) {
  const [messages, setMessages] = useState<SerializedContactMessage[]>(initialMessages)
  const [comments, setComments] = useState<SerializedCommentWithPost[]>(initialComments)
  const [metrics] = useState<SerializedPerformanceMetric[]>(initialMetrics)
  const [isLoading, setIsLoading] = useState(false)
  
  // 筛选和分页状态
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days' | '90days'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  
  // 计算未读消息数量
  const unreadCount = messages.filter(msg => !msg.read).length
  
  // 计算统计数据
  const stats = {
    total: messages.length,
    read: messages.filter(msg => msg.read).length,
    unread: unreadCount,
  }

  // 刷新消息列表
  const refreshMessages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/messages?refresh=true')
      if (!response.ok) throw new Error('Failed to refresh messages')
      const data = await response.json()
      setMessages(data.messages)
      setComments(data.comments)
    } catch (error) {
      console.error('Error refreshing messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 标记为已读
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

  // 删除消息
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

  // 删除评论
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

  // 过滤消息
  const filteredMessages = messages.filter(message => {
    // 搜索词筛选
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    // 状态筛选
    let matchesStatus = true
    if (statusFilter === 'read') matchesStatus = message.read
    if (statusFilter === 'unread') matchesStatus = !message.read
    
    // 日期筛选
    let matchesDate = true
    const msgDate = new Date(message.createdAt)
    const now = new Date()
    
    if (dateFilter === '7days') {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))
      matchesDate = msgDate >= sevenDaysAgo
    } else if (dateFilter === '30days') {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
      matchesDate = msgDate >= thirtyDaysAgo
    } else if (dateFilter === '90days') {
      const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90))
      matchesDate = msgDate >= ninetyDaysAgo
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })
  
  // 计算总页数
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE)
  
  // 获取当前页的消息
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )
  
  // 页面变化时重置到第一页
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, dateFilter])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">消息管理</h1>
        <div className="flex items-center gap-3">
          <Badge variant={unreadCount > 0 ? "destructive" : "outline"} className="text-sm">
            {unreadCount} 未读消息
          </Badge>
          <Button onClick={refreshMessages} disabled={isLoading} variant="outline" size="sm">
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">刷新</span>
          </Button>
        </div>
      </div>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 flex flex-col">
          <span className="text-sm text-gray-500">总消息数</span>
          <span className="text-2xl font-bold">{stats.total}</span>
        </Card>
        <Card className="p-4 flex flex-col">
          <span className="text-sm text-gray-500">已读消息</span>
          <span className="text-2xl font-bold text-green-600">{stats.read}</span>
        </Card>
        <Card className="p-4 flex flex-col">
          <span className="text-sm text-gray-500">未读消息</span>
          <span className="text-2xl font-bold text-red-600">{stats.unread}</span>
        </Card>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="messages">
            联系消息 ({messages.length})
          </TabsTrigger>
          <TabsTrigger value="comments">
            博客评论 ({comments.length})
          </TabsTrigger>
          <TabsTrigger value="metrics">
            性能指标
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          {/* 筛选工具栏 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索消息..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <div className="flex items-center h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  <Select 
                    value={statusFilter} 
                    onValueChange={(value) => setStatusFilter(value as 'all' | 'read' | 'unread')}
                  >
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="read">已读</SelectItem>
                    <SelectItem value="unread">未读</SelectItem>
                  </Select>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center h-10">
                  <Calendar className="h-4 w-4 mr-2" />
                  <Select 
                    value={dateFilter} 
                    onValueChange={(value) => setDateFilter(value as 'all' | '7days' | '30days' | '90days')}
                  >
                    <SelectItem value="all">全部时间</SelectItem>
                    <SelectItem value="7days">最近7天</SelectItem>
                    <SelectItem value="30days">最近30天</SelectItem>
                    <SelectItem value="90days">最近90天</SelectItem>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {/* 消息表格 */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">消息内容</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedMessages.length > 0 ? (
                    paginatedMessages.map((message) => (
                      <tr key={message.id} className={message.read ? '' : 'bg-blue-50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {message.read ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="flex items-center">
                              <span className="inline-block h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                              <span className="text-sm font-medium">未读</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{message.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="line-clamp-2 max-w-md">{message.message}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(message.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          {!message.read && (
                            <Button 
                              onClick={() => handleMarkAsRead(message.id)}
                              variant="outline"
                              size="sm"
                            >
                              标记已读
                            </Button>
                          )}
                          <Button 
                            onClick={() => handleDeleteMessage(message.id)}
                            variant="destructive"
                            size="sm"
                          >
                            删除
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                        没有找到符合条件的消息
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                显示 {filteredMessages.length} 条消息中的 
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredMessages.length)} 条
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center text-sm">
                  {currentPage} / {totalPages}
                </div>
                <Button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="comments">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文章</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">评论</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comments.map((comment) => (
                  <tr key={comment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comment.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.post.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="line-clamp-2 max-w-md">{comment.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button 
                        onClick={() => handleDeleteComment(comment.id)}
                        variant="destructive"
                        size="sm"
                      >
                        删除
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">指标名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数值</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标签</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">页面</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
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
        </TabsContent>
      </Tabs>
    </div>
  )
} 