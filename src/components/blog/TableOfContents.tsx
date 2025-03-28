'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // 获取所有标题元素
    const elements = Array.from(document.querySelectorAll('h1, h2, h3'))
    const items: Heading[] = elements.map((element) => ({
      id: element.id,
      text: element.textContent || '',
      level: Number(element.tagName[1]),
    }))
    setHeadings(items)

    // 监听滚动事件，更新当前阅读位置
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (headings.length === 0) return null

  return (
    <nav className="hidden lg:block sticky top-24 w-64 h-[calc(100vh-6rem)] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">目录</h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
            className="text-sm"
          >
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={`text-left hover:text-primary transition-colors ${
                activeId === heading.id
                  ? 'text-primary font-medium'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
} 