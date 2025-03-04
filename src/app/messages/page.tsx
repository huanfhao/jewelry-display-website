'use client'

import { useEffect, useState } from 'react'
import { ContactMessage, CookieData } from '@/types'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2, Search, Download, RefreshCw, Eye, EyeOff, Cookie } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'
import { useUserPreferences } from '@/hooks/useUserPreferences'
import { Pie } from '@visx/shape'
import { Group } from '@visx/group'
import { Text } from '@visx/text'

interface MessageStats {
  total: number
  read: number
  unread: number
  categories: {
    [key: string]: number
  }
}

interface Comment {
  id: string
  author: string
  email: string
  content: string
  createdAt: Date
  post_title: string
}

interface UserAnalytics {
  lastVisited: string[]
  searchHistory: string[]
  categoryPreferences: string[]
  visitHistory: Array<{
    date: Date
    count: number
  }>
  deviceInfo: {
    browser: string
    os: string
    device: string
    screenSize: string
    language: string
    timezone: string
  }
  visitCount: number
  lastActive: Date
  engagementMetrics: {
    avgTimeOnSite: number
    bounceRate: number
    returnRate: number
  }
}

// Cookie 分类
const COOKIE_CATEGORIES = {
  essential: '必要',
  preferences: '偏好',
  analytics: '分析',
  marketing: '营销'
}

// 添加扇形图组件
function PieChart({ data }: { data: { label: string; value: number }[] }) {
  const width = 200
  const height = 200
  const radius = Math.min(width, height) / 2
  const centerY = height / 2
  const centerX = width / 2

  return (
    <svg width={width} height={height}>
      <Group top={centerY} left={centerX}>
        <Pie
          data={data}
          pieValue={d => d.value}
          outerRadius={radius}
          innerRadius={radius / 2}
        >
          {pie => {
            return pie.arcs.map((arc, index) => {
              const [centroidX, centroidY] = pie.path.centroid(arc)
              return (
                <g key={`pie-arc-${index}`}>
                  <path
                    d={pie.path(arc) || ''}
                    fill={`hsl(${(index * 360) / data.length}, 70%, 50%)`}
                  />
                  <Text
                    x={centroidX}
                    y={centroidY}
                    dy=".33em"
                    fontSize={12}
                    textAnchor="middle"
                    fill="white"
                  >
                    {arc.data.label}
                  </Text>
                </g>
              )
            })
          }}
        </Pie>
      </Group>
    </svg>
  )
}

export default function MessagesPage() {
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState<MessageStats>({
    total: 0,
    read: 0,
    unread: 0,
    categories: {}
  })
  const { preferences, updatePreferences } = useUserPreferences()

  // 添加用户分析数据
  const [analytics, setAnalytics] = useState<UserAnalytics>({
    lastVisited: [],
    searchHistory: [],
    categoryPreferences: [],
    visitHistory: [],
    deviceInfo: {
      browser: '',
      os: '',
      device: '',
      screenSize: '',
      language: '',
      timezone: ''
    },
    visitCount: 0,
    lastActive: new Date(),
    engagementMetrics: {
      avgTimeOnSite: 0,
      bounceRate: 0,
      returnRate: 0
    }
  })

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/messages')
      const data = await response.json()
      
      if (response.ok) {
        setContactMessages(data.contactMessages)
        setComments(data.comments)
        updateStats(data.contactMessages)
      } else {
        toast.error('Failed to fetch messages')
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Error loading messages')
    } finally {
      setLoading(false)
    }
  }

  function updateStats(messages: ContactMessage[]) {
    const stats: MessageStats = {
      total: messages.length,
      read: messages.filter(m => m.read).length,
      unread: messages.filter(m => !m.read).length,
      categories: {}
    }
    setStats(stats)
  }

  const filteredMessages = contactMessages.filter(message =>
    message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 切换消息已读状态
  async function toggleMessageRead(id: string, currentRead: boolean) {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentRead })
      })

      if (response.ok) {
        setContactMessages(messages =>
          messages.map(m =>
            m.id === id ? { ...m, read: !m.read } : m
          )
        )
        updateStats(contactMessages)
        toast.success('Message status updated')
      } else {
        toast.error('Failed to update message status')
      }
    } catch (error) {
      console.error('Error updating message:', error)
      toast.error('Error updating message')
    }
  }

  // 删除消息
  async function deleteMessage(id: string) {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setContactMessages(messages =>
          messages.filter(m => m.id !== id)
        )
        updateStats(contactMessages)
        toast.success('Message deleted')
      } else {
        toast.error('Failed to delete message')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Error deleting message')
    }
  }

  // 删除评论
  async function deleteComment(id: string) {
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setComments(comments =>
          comments.filter(c => c.id !== id)
        )
        toast.success('Comment deleted')
      } else {
        toast.error('Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Error deleting comment')
    }
  }

  // 获取用户分析数据
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/admin/analytics')
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-playfair">消息中心</h1>
        <div className="flex gap-4">
          <Input
            placeholder="搜索消息..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
            icon={<Search className="w-4 h-4" />}
          />
          <Button onClick={fetchMessages}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-500">总消息数</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-500">已读</h3>
          <p className="text-2xl font-bold text-green-600">{stats.read}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-500">未读</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.unread}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-gray-500">评论数</h3>
          <p className="text-2xl font-bold text-blue-600">{comments.length}</p>
        </div>
      </div>
      
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="messages">
            联系消息 ({contactMessages.length})
          </TabsTrigger>
          <TabsTrigger value="comments">
            博客评论 ({comments.length})
          </TabsTrigger>
          <TabsTrigger value="cookies">
            用户数据
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">消息内容</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map(message => (
                  <tr key={message.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{message.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{message.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{message.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        message.read 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {message.read ? '已读' : '未读'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(message.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleMessageRead(message.id, message.read)}
                        title={message.read ? '标记为未读' : '标记为已读'}
                      >
                        {message.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMessage(message.id)}
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="comments">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">评论内容</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文章</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comments.map(comment => (
                  <tr key={comment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{comment.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{comment.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{comment.content}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{comment.post_title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(comment.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteComment(comment.id)}
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="cookies">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">用户数据分析</h2>
              <div className="flex gap-2">
                <Button onClick={() => updatePreferences({})}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  清除全部
                </Button>
                <Button onClick={() => {
                  const jsonString = JSON.stringify({ preferences, analytics }, null, 2)
                  const blob = new Blob([jsonString], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'user-data.json'
                  a.click()
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 用户行为统计 */}
              <div>
                <h3 className="text-lg font-medium mb-4">用户行为</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-600">访问统计</h4>
                    <PieChart data={[
                      { label: '新访客', value: analytics.visitCount * 0.7 },
                      { label: '回访', value: analytics.visitCount * 0.3 }
                    ]} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-600">设备分布</h4>
                    <PieChart data={[
                      { label: '桌面', value: 60 },
                      { label: '移动', value: 30 },
                      { label: '平板', value: 10 }
                    ]} />
                  </div>
                </div>
              </div>

              {/* 用户偏好数据 */}
              <div>
                <h3 className="text-lg font-medium mb-4">用户偏好</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-600 mb-2">最近访问页面</h4>
                    <ul className="space-y-2">
                      {analytics.lastVisited.map((page, index) => (
                        <li key={index} className="text-sm text-gray-600">{page}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-600 mb-2">搜索历史</h4>
                    <ul className="space-y-2">
                      {analytics.searchHistory.map((term, index) => (
                        <li key={index} className="text-sm text-gray-600">{term}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-600 mb-2">设备信息</h4>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <dt className="text-gray-500">浏览器</dt>
                      <dd>{analytics.deviceInfo.browser}</dd>
                      <dt className="text-gray-500">操作系统</dt>
                      <dd>{analytics.deviceInfo.os}</dd>
                      <dt className="text-gray-500">设备</dt>
                      <dd>{analytics.deviceInfo.device}</dd>
                      <dt className="text-gray-500">屏幕尺寸</dt>
                      <dd>{analytics.deviceInfo.screenSize}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookie 数据 */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Cookie 数据</h3>
              <div className="space-y-6">
                {Object.entries(preferences).map(([key, value]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cookie className="w-4 h-4" />
                      <h4 className="font-medium">{key}</h4>
                    </div>
                    <pre className="bg-gray-50 p-2 rounded text-sm">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 