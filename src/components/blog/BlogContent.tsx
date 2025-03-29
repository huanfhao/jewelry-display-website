'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface BlogContentProps {
  content: string
}

export default function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // 代码块样式
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          // 图片样式
          img({ src, alt }) {
            return (
              <div className="my-8">
                <img
                  src={src}
                  alt={alt}
                  className="rounded-lg shadow-lg mx-auto max-w-full"
                />
              </div>
            )
          },
          // 标题样式
          h1({ children }) {
            return (
              <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
                {children}
              </h1>
            )
          },
          h2({ children }) {
            return (
              <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">
                {children}
              </h2>
            )
          },
          h3({ children }) {
            return (
              <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">
                {children}
              </h3>
            )
          },
          // 段落样式
          p({ children }) {
            return (
              <p className="my-4 leading-relaxed text-gray-700 dark:text-gray-300">
                {children}
              </p>
            )
          },
          // 列表样式
          ul({ children }) {
            return (
              <ul className="list-disc list-inside my-4 text-gray-700 dark:text-gray-300">
                {children}
              </ul>
            )
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-inside my-4 text-gray-700 dark:text-gray-300">
                {children}
              </ol>
            )
          },
          // 引用样式
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-gray-700 dark:text-gray-300">
                {children}
              </blockquote>
            )
          },
          // 链接样式
          a({ href, children }) {
            return (
              <a
                href={href}
                className="text-primary hover:text-primary/80 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
} 