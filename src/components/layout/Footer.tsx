'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary/5 border-t border-primary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-serif text-primary">SY Jewelry</h3>
            <p className="text-primary/70 leading-relaxed">
              A brand dedicated to designing and crafting high-quality jewelry, creating unique pieces for you.
            </p>
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="text-primary/60 hover:text-accent transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-primary/60 hover:text-accent transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-primary/60 hover:text-accent transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-primary/90">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/products" 
                  className="text-primary/70 hover:text-accent transition-colors duration-300 inline-flex items-center group"
                >
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                    All Products
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-primary/70 hover:text-accent transition-colors duration-300 inline-flex items-center group"
                >
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-primary/70 hover:text-accent transition-colors duration-300 inline-flex items-center group"
                >
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                    Contact Us
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-primary/70 hover:text-accent transition-colors duration-300 inline-flex items-center group"
                >
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                    Blog & News
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Center */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-primary/90">Help Center</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/shipping" 
                  className="text-primary/70 hover:text-accent transition-colors duration-300 inline-flex items-center group"
                >
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                    Shipping Info
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/returns" 
                  className="text-primary/70 hover:text-accent transition-colors duration-300 inline-flex items-center group"
                >
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                    Returns Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/size-guide" 
                  className="text-primary/70 hover:text-accent transition-colors duration-300 inline-flex items-center group"
                >
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                    Size Guide
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-primary/70 hover:text-accent transition-colors duration-300 inline-flex items-center group"
                >
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                    FAQ
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-primary/90">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-primary/70 group">
                <span className="mt-1">📍</span>
                <span className="group-hover:text-accent transition-colors duration-300">
                  888 Nanjing East Road, Huangpu District, Shanghai
                </span>
              </li>
              <li className="flex items-start space-x-3 text-primary/70 group">
                <span className="mt-1">📞</span>
                <span className="group-hover:text-accent transition-colors duration-300">
                  021-88888888
                </span>
              </li>
              <li className="flex items-start space-x-3 text-primary/70 group">
                <span className="mt-1">✉️</span>
                <span className="group-hover:text-accent transition-colors duration-300">
                  contact@syjewelry.com
                </span>
              </li>
              <li className="flex items-start space-x-3 text-primary/70 group">
                <span className="mt-1">⏰</span>
                <span className="group-hover:text-accent transition-colors duration-300">
                  Monday - Sunday 10:00-22:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 mt-16 pt-8 text-sm text-center">
          <p className="text-primary/60">
            &copy; {new Date().getFullYear()} SY Jewelry. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 