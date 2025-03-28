export default function ProductLoadingPage() {
  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 产品图片骨架屏 */}
        <div className="aspect-square rounded-lg bg-gray-200 animate-pulse"></div>

        {/* 产品详情骨架屏 */}
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>
            
            <div className="p-6 border rounded-lg">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
          
          {/* 询价表单骨架屏 */}
          <div className="space-y-4 border rounded-lg p-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32 ml-auto"></div>
          </div>
        </div>
      </div>
      
      {/* 相关产品骨架屏 */}
      <div className="mt-20">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 