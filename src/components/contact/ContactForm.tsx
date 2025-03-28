'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

// 定义表单验证模式
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters')
})

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: '' })
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    generateCaptcha()
  }, [])

  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10)
    const num2 = Math.floor(Math.random() * 10)
    setCaptcha({ num1, num2, answer: '' })
    setCorrectAnswer(num1 + num2)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // 清除相关字段的错误（当用户开始编辑时）
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors({})

    // 验证人机验证答案
    if (parseInt(captcha.answer) !== correctAnswer) {
      toast.error('Incorrect verification answer, please try again')
      generateCaptcha()
      return
    }

    // 表单验证
    try {
      contactSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(formattedErrors)
        return
      }
    }

    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        // 处理服务器返回的验证错误
        if (response.status === 400 && result.details) {
          const serverErrors: Record<string, string> = {}
          
          // 格式化来自服务器的Zod错误
          Object.entries(result.details).forEach(([field, error]) => {
            if (typeof error === 'object' && error && '_errors' in error) {
              const errorsArray = (error as { _errors: string[] })._errors
              if (errorsArray.length > 0) {
                serverErrors[field] = errorsArray[0]
              }
            }
          })
          
          setErrors(serverErrors)
          toast.error('Please correct the errors in the form')
        } else {
          throw new Error(result.error || result.message || 'Failed to send message')
        }
      } else {
        // 成功处理
        setSuccess(true)
        toast.success('Message sent successfully! We will reply to you soon.')
        
        // 重置表单
        setFormData({ name: '', email: '', message: '' })
        generateCaptcha()
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to send message, please try again later')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input
          required
          name="name"
          className="h-12"
          placeholder="Enter your name"
          disabled={loading}
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input
          required
          type="email"
          name="email"
          className="h-12"
          placeholder="Enter your email"
          disabled={loading}
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Message</label>
        <Textarea
          required
          name="message"
          rows={5}
          className="resize-none"
          placeholder="Enter your message"
          disabled={loading}
          value={formData.message}
          onChange={handleChange}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
      </div>

      {/* Verification */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Please calculate: {captcha.num1} + {captcha.num2} = ?
        </label>
        <Input
          required
          type="number"
          value={captcha.answer}
          onChange={(e) => setCaptcha({ ...captcha, answer: e.target.value })}
          className="h-12"
          placeholder="Enter the result"
          disabled={loading}
        />
      </div>

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-md">
          Thank you for your message! We will contact you soon.
        </div>
      )}

      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full h-12 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : 'Send Message'}
      </Button>
    </form>
  )
} 