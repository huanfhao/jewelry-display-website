'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NProgress from 'nprogress';

const STORE_URL = 'https://store.flylinking.com/s/2UPEH35FWO';

const MENU_ITEMS = [
  { href: '/', label: 'Home' },
  { href: STORE_URL, label: 'Shop', external: true },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleExternalLink = (href: string) => {
    NProgress.start();
    setTimeout(() => {
      window.open(href, '_blank');
      NProgress.done();
    }, 500);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-playfair">
          SY Jewelry Display
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {MENU_ITEMS.map((item) => (
            item.external ? (
              <button
                key={item.href}
                onClick={() => handleExternalLink(item.href)}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

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
                  {item.external ? (
                    <button
                      onClick={() => {
                        handleExternalLink(item.href);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-sm font-medium hover:text-primary transition-colors"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block text-sm font-medium transition-colors ${
                        pathname === item.href ? 'text-primary' : 'hover:text-primary'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 