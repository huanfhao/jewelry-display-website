'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary/10 backdrop-blur-md fixed w-full top-0 z-50 border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-serif font-bold text-primary hover:text-primary/80 transition-colors"
          >
            SY Jewelry
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <Link 
              href="/" 
              className="text-primary/80 hover:text-primary transition-colors duration-200 text-sm font-medium"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="text-primary/80 hover:text-primary transition-colors duration-200 text-sm font-medium"
            >
              All Products
            </Link>
            <Link 
              href="/about" 
              className="text-primary/80 hover:text-primary transition-colors duration-200 text-sm font-medium"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="text-primary/80 hover:text-primary transition-colors duration-200 text-sm font-medium"
            >
              Contact Us
            </Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-primary/10 text-primary/80 hover:text-primary transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            {session ? (
              <Link href="/account">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-primary/10 text-primary/80 hover:text-primary transition-colors"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button 
                  variant="default"
                  className="bg-accent hover:bg-accent/90 text-primary font-medium px-6 hover:shadow-md transition-all duration-300"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-primary/10 text-primary/80 hover:text-primary transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-slide-in-right bg-background/95 backdrop-blur-md">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-primary/80 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-primary/80 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                href="/about"
                className="text-primary/80 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-primary/80 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              <div className="border-t border-primary/10 pt-4">
                <Link
                  href="/cart"
                  className="flex items-center text-primary/80 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart
                </Link>
                {session ? (
                  <Link
                    href="/account"
                    className="flex items-center text-primary/80 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    My Account
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center text-primary/80 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 