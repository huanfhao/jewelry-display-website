import BlogPostForm from '@/components/admin/blog/BlogPostForm'

export default function NewBlogPostPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">新建文章</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <BlogPostForm />
      </div>
    </div>
  )
} 