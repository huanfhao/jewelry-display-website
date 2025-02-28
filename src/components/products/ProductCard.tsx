import OptimizedImage from '@/components/common/OptimizedImage'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative">
      <OptimizedImage
        src={product.image}
        alt={product.name}
        width={400}
        height={400}
        className="w-full aspect-square object-cover rounded-lg"
      />
      {/* ... 其他内容 ... */}
    </div>
  )
} 