'use client'

import { useEffect, useState, Suspense } from 'react'
import { ContactMessage, CookieData } from '@/types'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2, Search, Download, RefreshCw, Eye, EyeOff, Cookie } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUserPreferences } from '@/hooks/useUserPreferences'
import LoadingFallback from '@/components/common/LoadingFallback'

// 将密码移到环境变量中
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sy2024'

interface MessageStats {
  total: number
  read: number
  unread: number
  categories: {
    [key: string]: number
  }
}

// Cookie 分类
const COOKIE_CATEGORIES = {
  essential: '必要',
  preferences: '偏好',
  analytics: '分析',
  marketing: '营销'
}

// 获取 cookie 分类
const getCookieCategory = (name: string): string => {
  if (name.includes('user-preferences')) return COOKIE_CATEGORIES.preferences
  if (name.includes('cookie-consent')) return COOKIE_CATEGORIES.essential
  if (name.includes('ga') || name.includes('_ga')) return COOKIE_CATEGORIES.analytics
  if (name.includes('fb') || name.includes('_fbp')) return COOKIE_CATEGORIES.marketing
  return COOKIE_CATEGORIES.essential
}

// 用户行为分析
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

// 图表类型定义
interface VisitData {
  date: Date
  count: number
}

interface VisitTrendChartProps {
  data: VisitData[]
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [stats, setStats] = useState<MessageStats>({
    total: 0,
    read: 0,
    unread: 0,
    categories: {}
  })
  const [activeTab, setActiveTab] = useState<'messages' | 'cookies'>('messages')
  const [cookieData, setCookieData] = useState<CookieData[]>([])
  const { preferences } = useUserPreferences()
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics>({
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

  // 过滤和搜索消息
  const filteredMessages = messages
    .filter(msg => {
      if (filter === 'unread') return !msg.read
      if (filter === 'read') return !!msg.read
      return true
    })
    .filter(msg => 
      (msg.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (msg.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (msg.message?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
    )

  // 导出消息为 CSV
  const exportMessages = () => {
    const headers = ['Name', 'Email', 'Message', 'Status', 'Date']
    const csvData = filteredMessages.map(msg => [
      msg.name ?? '',
      msg.email ?? '',
      (msg.message ?? '').replace(/,/g, ';'),
      msg.read ? 'Read' : 'Unread',
      msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''
    ])
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `messages-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

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
      calculateStats(data)
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

  function calculateStats(messages: ContactMessage[]) {
    const stats: MessageStats = {
      total: messages.length,
      read: messages.filter(msg => msg.read ?? false).length,
      unread: messages.filter(msg => !msg.read).length,
      categories: {}
    }

    messages.forEach(msg => {
      const category = msg.message?.split('\n')[0]?.split(': ')[0] ?? 'Other'
      if (category) {
        stats.categories[category] = (stats.categories[category] ?? 0) + 1
      }
    })

    setStats(stats)
  }

  useEffect(() => {
    if (isAuthenticated && activeTab === 'cookies') {
      loadCookieData()
      loadUserAnalytics()
    }
  }, [isAuthenticated, activeTab])

  const loadCookieData = () => {
    const cookies = document.cookie.split(';')
    const cookieList: CookieData[] = cookies.map(cookie => {
      const [name, value] = cookie.split('=').map(part => part.trim())
      const category = getCookieCategory(name)
      return {
        name,
        value,
        domain: window.location.hostname,
        expires: 'Session',
        category
      }
    })

    if (preferences) {
      cookieList.push({
        name: 'User Preferences',
        value: JSON.stringify(preferences, null, 2),
        domain: window.location.hostname,
        expires: '1 year',
        category: COOKIE_CATEGORIES.preferences
      })
    }

    setCookieData(cookieList)
  }

  const handleClearCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    loadCookieData()
  }

  const loadUserAnalytics = () => {
    // 从用户偏好中获取数据
    const { lastVisited = [], searchHistory = [], categoryPreferences = [] } = preferences || {}
    
    // 获取设备信息
    const ua = navigator.userAgent
    const browser = ua.includes('Chrome') ? 'Chrome' : 
                   ua.includes('Firefox') ? 'Firefox' : 
                   ua.includes('Safari') ? 'Safari' : 'Other'
    const os = ua.includes('Windows') ? 'Windows' :
               ua.includes('Mac') ? 'MacOS' :
               ua.includes('Linux') ? 'Linux' : 'Other'
    const device = ua.includes('Mobile') ? 'Mobile' : 'Desktop'
    
    // 获取更多设备信息
    const screenSize = `${window.screen.width}x${window.screen.height}`
    const language = navigator.language
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // 生成访问历史数据（示例）
    const visitHistory = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return {
        date,
        count: Math.floor(Math.random() * 10) + 1
      }
    }).reverse()

    setUserAnalytics({
      lastVisited,
      searchHistory,
      categoryPreferences,
      visitHistory,
      deviceInfo: { 
        browser, 
        os, 
        device,
        screenSize,
        language,
        timezone
      },
      visitCount: parseInt(localStorage.getItem('visitCount') || '0'),
      lastActive: new Date(localStorage.getItem('lastActive') || Date.now()),
      engagementMetrics: {
        avgTimeOnSite: Math.round(Math.random() * 300), // 示例数据
        bounceRate: Math.round(Math.random() * 100),
        returnRate: Math.round(Math.random() * 100)
      }
    })
  }

  // 简单的访问趋势展示组件
  const VisitTrendDisplay: React.FC<VisitTrendChartProps> = ({ data }) => {
    return (
      <div className="space-y-4">
        {data.map((visit, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {visit.date.toLocaleDateString()}
            </span>
            <div className="flex-1 mx-4">
              <div 
                className="h-2 bg-blue-200 rounded"
                style={{ 
                  width: `${(visit.count / Math.max(...data.map(d => d.count))) * 100}%`
                }}
              />
            </div>
            <span className="text-sm font-medium">{visit.count} visits</span>
          </div>
        ))}
      </div>
    )
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
    <Suspense fallback={<LoadingFallback />}>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">管理面板</h1>
            <Button 
              variant="outline"
              onClick={() => setIsAuthenticated(false)}
            >
              退出登录
            </Button>
          </div>

          {/* 标签切换 */}
          <div className="flex gap-4 border-b">
            <button
              className={`pb-2 px-4 ${activeTab === 'messages' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                消息管理
              </span>
            </button>
            <button
              className={`pb-2 px-4 ${activeTab === 'cookies' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('cookies')}
            >
              <span className="flex items-center gap-2">
                <Cookie className="w-4 h-4" />
                用户数据
              </span>
            </button>
          </div>

          {activeTab === 'messages' ? (
            <>
              <div className="flex flex-col space-y-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* 搜索栏 */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="搜索消息..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>

                  {/* 过滤按钮组 */}
                  <div className="flex gap-2">
                    <Button
                      variant={filter === 'all' ? 'default' : 'outline'}
                      onClick={() => setFilter('all')}
                    >
                      全部
                    </Button>
                    <Button
                      variant={filter === 'unread' ? 'default' : 'outline'}
                      onClick={() => setFilter('unread')}
                    >
                      <EyeOff className="w-4 h-4 mr-2" />
                      未读
                    </Button>
                    <Button
                      variant={filter === 'read' ? 'default' : 'outline'}
                      onClick={() => setFilter('read')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      已读
                    </Button>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={exportMessages}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      导出
                    </Button>
                    <Button
                      variant="outline"
                      onClick={fetchMessages}
                      disabled={loading}
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                  <div className="p-4 text-center">加载中...</div>
                ) : filteredMessages.length === 0 ? (
                  <div className="p-4 text-center">暂无消息</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredMessages.map((message) => (
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
                        <p className="mt-2 text-gray-700 whitespace-pre-wrap">{message.message}</p>
                        <p className="mt-2 text-sm text-gray-500">
                          {new Date(message.createdAt!).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Cookie 分类</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(COOKIE_CATEGORIES).map(([key, label]) => (
                    <div key={key} className="p-4 bg-white rounded-lg shadow">
                      <h3 className="text-lg font-medium mb-2">{label}</h3>
                      <p className="text-2xl font-bold">
                        {cookieData.filter(cookie => cookie.category === label).length}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Table>
                <TableCaption>所有 Cookie 和用户偏好设置列表</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>名称</TableHead>
                    <TableHead>值</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>域名</TableHead>
                    <TableHead>过期时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cookieData.map((cookie, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{cookie.name}</TableCell>
                      <TableCell>
                        <div className="max-w-xs overflow-hidden text-ellipsis">
                          {cookie.value}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          cookie.category === COOKIE_CATEGORIES.essential ? 'bg-blue-100 text-blue-800' :
                          cookie.category === COOKIE_CATEGORIES.preferences ? 'bg-green-100 text-green-800' :
                          cookie.category === COOKIE_CATEGORIES.analytics ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {cookie.category}
                        </span>
                      </TableCell>
                      <TableCell>{cookie.domain}</TableCell>
                      <TableCell>{cookie.expires}</TableCell>
                      <TableCell className="text-right">
                        {cookie.category !== COOKIE_CATEGORIES.essential && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleClearCookie(cookie.name)}
                          >
                            Clear
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Cookie 统计</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-2">总大小</h3>
                    <p className="text-2xl font-bold">
                      {Math.round(JSON.stringify(cookieData).length / 1024)} KB
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-2">最后更新</h3>
                    <p className="text-2xl font-bold">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-2">Cookie 政策</h3>
                    <a 
                      href="/privacy-policy" 
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      查看详情
                    </a>
                  </div>
                </div>
              </div>

              {/* 用户分析部分 */}
              <div className="mt-12">
                <h2 className="text-xl font-semibold mb-6">用户分析</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 访问趋势 */}
                  <div className="bg-white rounded-lg shadow p-6 col-span-2">
                    <h3 className="text-lg font-medium mb-4">访问趋势</h3>
                    <div className="h-[300px]">
                      <VisitTrendDisplay data={userAnalytics.visitHistory} />
                    </div>
                  </div>

                  {/* 用户行为 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium mb-4">用户行为</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-600">最近访问页面</h4>
                        <ul className="mt-2 space-y-1">
                          {userAnalytics.lastVisited.map((page, index) => (
                            <li key={index} className="text-sm text-gray-600">{page}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-600">搜索历史</h4>
                        <ul className="mt-2 space-y-1">
                          {userAnalytics.searchHistory.map((term, index) => (
                            <li key={index} className="text-sm text-gray-600">{term}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-600">分类偏好</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {userAnalytics.categoryPreferences.map((category, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 设备信息 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium mb-4">设备信息</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">浏览器</span>
                        <span className="font-medium">{userAnalytics.deviceInfo.browser}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">操作系统</span>
                        <span className="font-medium">{userAnalytics.deviceInfo.os}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">设备类型</span>
                        <span className="font-medium">{userAnalytics.deviceInfo.device}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">屏幕尺寸</span>
                        <span className="font-medium">{userAnalytics.deviceInfo.screenSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">语言</span>
                        <span className="font-medium">{userAnalytics.deviceInfo.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">时区</span>
                        <span className="font-medium">{userAnalytics.deviceInfo.timezone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">访问次数</span>
                        <span className="font-medium">{userAnalytics.visitCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">最后活跃</span>
                        <span className="font-medium">
                          {userAnalytics.lastActive.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 参与度指标 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium mb-4">参与度指标</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">平均停留时间</span>
                        <span className="font-medium">{userAnalytics.engagementMetrics.avgTimeOnSite}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">跳出率</span>
                        <span className="font-medium">{userAnalytics.engagementMetrics.bounceRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">回访率</span>
                        <span className="font-medium">{userAnalytics.engagementMetrics.returnRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Suspense>
  )
} 