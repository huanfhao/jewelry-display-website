export default function BlogLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-playfair mb-8 text-center">Our Blog</h1>
        <p className="text-gray-600 text-center mb-12">
          Latest news, updates and insights about jewelry displays
        </p>
        <div className="space-y-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-64 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 