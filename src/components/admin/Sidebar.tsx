'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Home } from 'lucide-react'

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <nav className="flex-1 px-2 py-4 space-y-1">
        {ADMIN_LINKS.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center px-4 py-2 text-sm font-medium rounded-md
                ${pathname === link.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className="mr-3 h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 