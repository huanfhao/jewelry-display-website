'use client'

import Link from 'next/link'
import Image from 'next/image'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  publishedAt: Date | null
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {posts.map(post => (
        <Link 
          key={post.id} 
          href={`/blog/${post.slug}`}
          className="group flex flex-col h-full"
        >
          <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            {post.coverImage && (
              <div className="aspect-[4/3] relative w-full">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
              )}
              {post.publishedAt && (
                <p className="text-sm text-gray-500 mt-auto">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 