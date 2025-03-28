'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NProgress from 'nprogress';
import { useSession, signOut } from 'next-auth/react';

const MENU_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    NProgress.configure({ 
      showSpinner: false,
      minimum: 0.3,
      easing: 'ease',
      speed: 200
    });
  }, []);

  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.start();
    };
  }, [pathname, searchParams]);

  return (
    <Suspense fallback={null}>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/logo.png"
                alt="SY Jewelry Display Logo"
                width={48}
                height={48}
                className="object-contain w-12 h-12"
                priority
              />
              <span className="text-xl font-playfair">SY Jewelry Display</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href ? 'text-primary' : 'hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  {session.user.role === 'ADMIN' && (
                    <Link href="/dashboard" className="hover:text-blue-600">
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-red-600 hover:text-red-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Register
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t bg-white"
              >
                <nav className="container mx-auto px-4 py-4">
                  {MENU_ITEMS.map((item) => (
                    <div key={item.href} className="py-2">
                      <Link
                        href={item.href}
                        className={`block text-sm font-medium transition-colors ${
                          pathname === item.href ? 'text-primary' : 'hover:text-primary'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </div>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </Suspense>
  );
} 