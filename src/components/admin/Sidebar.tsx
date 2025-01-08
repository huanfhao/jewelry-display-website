'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LuUsers, LuLayoutDashboard, LuPackage, LuShoppingCart } from 'react-icons/lu'

const navigation = [
  { name: '仪表盘', href: '/admin', icon: LuLayoutDashboard },
  { name: '商品管理', href: '/admin/products', icon: LuPackage },
  { name: '订单管理', href: '/admin/orders', icon: LuShoppingCart },
  { name: '用户管理', href: '/admin/users', icon: LuUsers },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md
                  transition-colors duration-150 ease-in-out
                  ${isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'}
                  `}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
} 