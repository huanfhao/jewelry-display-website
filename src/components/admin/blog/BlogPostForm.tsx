'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface BlogPostFormProps {
  initialData?: {
    id: string
    title: string
    content: string
    excerpt: string | null
    coverImage: string | null
    published: boolean
    publishedAt: string | null
    categories: string[]
    tags: string[]
  }
}

export default function BlogPostForm({ initialData }: BlogPostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([])
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    coverImage: initialData?.coverImage || '',
    published: initialData?.published || false,
    publishedAt: initialData?.publishedAt || '',
    categories: initialData?.categories || [],
    tags: initialData?.tags || [],
  })

  // 获取分类和标签列表
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/blog/categories'),
          fetch('/api/blog/tags'),
        ])
        const [categoriesData, tagsData] = await Promise.all([
          categoriesRes.json(),
          tagsRes.json(),
        ])
        setCategories(categoriesData)
        setTags(tagsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('获取分类和标签失败')
      }
    }
    fetchData()
  }, [])

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(
        initialData ? `/api/blog/${initialData.id}` : '/api/blog',
        {
          method: initialData ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        throw new Error('保存失败')
      }

      toast.success(initialData ? '文章已更新' : '文章已创建')
      router.push('/dashboard/blog')
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('保存文章失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('上传失败')
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, coverImage: data.url }))
      toast.success('图片上传成功')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('图片上传失败')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">标题</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="excerpt">摘要</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="content">内容</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={10}
            required
          />
        </div>

        <div>
          <Label htmlFor="coverImage">封面图</Label>
          <Input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {formData.coverImage && (
            <div className="mt-2">
              <img
                src={formData.coverImage}
                alt="封面图预览"
                className="w-48 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, published: checked }))}
          />
          <Label htmlFor="published">发布</Label>
        </div>

        {formData.published && (
          <div>
            <Label htmlFor="publishedAt">发布时间</Label>
            <Input
              id="publishedAt"
              type="datetime-local"
              value={formData.publishedAt}
              onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
            />
          </div>
        )}

        <div>
          <Label>分类</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.categories.includes(category.id)}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...formData.categories, category.id]
                      : formData.categories.filter(id => id !== category.id)
                    setFormData(prev => ({ ...prev, categories: newCategories }))
                  }}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label>标签</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.tags.includes(tag.id)}
                  onChange={(e) => {
                    const newTags = e.target.checked
                      ? [...formData.tags, tag.id]
                      : formData.tags.filter(id => id !== tag.id)
                    setFormData(prev => ({ ...prev, tags: newTags }))
                  }}
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/blog')}
        >
          取消
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {initialData ? '更新' : '创建'}
        </Button>
      </div>
    </form>
  )
} 