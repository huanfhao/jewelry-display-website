export default function BlogPostLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* 文章头部加载状态 */}
        <div className="mb-8">
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
          <div className="aspect-video bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
        </div>

        {/* 文章内容加载状态 */}
        <div className="space-y-4 mb-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>

        {/* 标签加载状态 */}
        <div className="flex flex-wrap gap-2 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
          ))}
        </div>

        {/* 相关文章加载状态 */}
        <div className="mt-12">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 