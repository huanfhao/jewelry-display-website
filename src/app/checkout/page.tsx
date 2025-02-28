'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('订单提交失败')

      toast({
        title: '订单提交成功',
        description: '我们会尽快处理您的订单'
      })
      
      router.push('/orders')
    } catch (error) {
      toast({
        title: '错误',
        description: error instanceof Error ? error.message : '订单提交失败',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">订单确认</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        <div>
          <label className="block mb-2">收货人姓名</label>
          <Input
            required
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="block mb-2">联系电话</label>
          <Input
            required
            type="tel"
            value={formData.phone}
            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
        <div>
          <label className="block mb-2">收货地址</label>
          <Textarea
            required
            value={formData.address}
            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
          />
        </div>
        <div>
          <label className="block mb-2">订单备注</label>
          <Textarea
            value={formData.note}
            onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))}
            placeholder="可选"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? '提交中...' : '提交订单'}
        </Button>
      </form>
    </div>
  )
} 