export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="h-10 bg-gray-200 rounded animate-pulse w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
      </div>
      
      {/* 筛选器占位 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* 产品网格占位 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 