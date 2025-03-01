'use client'

import { useEffect, useState, Suspense } from 'react'
import { ContactMessage } from '@/types'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2, Search, Download, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { Pie } from '@visx/shape'
import { Group } from '@visx/group'
import { Text } from '@visx/text'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

interface PieChartData {
  name: string
  value: number
}

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
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

  const pieData: PieChartData[] = Object.entries(stats.categories).map(([name, value]) => ({
    name,
    value
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  // 添加饼图组件
  const PieChartComponent: React.FC<PieChartProps> = ({ data }) => {
    const width = 400
    const height = 400
    const radius = Math.min(width, height) / 2
    const centerY = height / 2
    const centerX = width / 2

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <Group top={centerY} left={centerX}>
          <Pie
            data={data}
            pieValue={d => d.value}
            outerRadius={radius - 20}
            innerRadius={0}
            padAngle={0.01}
          >
            {pie => {
              return pie.arcs.map((arc, index) => {
                const [centroidX, centroidY] = pie.path.centroid(arc)
                const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1
                const arcPath = pie.path(arc)
                const arcFill = COLORS[index % COLORS.length]

                return (
                  <g key={`arc-${index}`}>
                    <path d={arcPath || ''} fill={arcFill} />
                    {hasSpaceForLabel && (
                      <text
                        x={centroidX}
                        y={centroidY}
                        dy=".33em"
                        fill="#ffffff"
                        fontSize={14}
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {arc.data.name}
                      </text>
                    )}
                  </g>
                )
              })
            }}
          </Pie>
        </Group>
      </svg>
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
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Contact Messages</h1>
            <Button 
              variant="outline"
              onClick={() => setIsAuthenticated(false)}
            >
              Logout
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索栏 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search messages..."
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
                All
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                onClick={() => setFilter('unread')}
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Unread
              </Button>
              <Button
                variant={filter === 'read' ? 'default' : 'outline'}
                onClick={() => setFilter('read')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Read
              </Button>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={exportMessages}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
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
            <div className="p-4 text-center">Loading...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-4 text-center">No messages found</div>
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

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* 扇形图 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Message Categories</h2>
            <div className="w-full h-[300px]">
              <PieChartComponent data={pieData} />
            </div>
          </div>

          {/* 统计表格 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Table>
              <TableCaption>Message Statistics Overview</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(stats.categories).map(([category, count]) => (
                  <TableRow key={category}>
                    <TableCell>{category}</TableCell>
                    <TableCell className="text-right">{count}</TableCell>
                    <TableCell className="text-right">
                      {((count / stats.total) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-medium">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">{stats.total}</TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span>Read Messages:</span>
                <span className="font-medium">{stats.read}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Unread Messages:</span>
                <span className="font-medium text-red-500">{stats.unread}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
} 