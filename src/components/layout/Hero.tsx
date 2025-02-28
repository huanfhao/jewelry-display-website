import Image from 'next/image'

export default function Hero() {
  return (
    <div className="relative w-full h-[600px]">
      <Image
        src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d"
        alt="Hero image"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover"
        onError={(e) => {
          console.error('Hero image load error:', e)
        }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold">SY Jewelry</h1>
          <p className="mt-4 text-xl">精美珠宝，独特设计，匠心之作</p>
        </div>
      </div>
    </div>
  )
} 