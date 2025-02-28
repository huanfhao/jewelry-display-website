'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Mail, Linkedin } from 'lucide-react';
import { FaTiktok, FaPinterest, FaXTwitter } from 'react-icons/fa6';
import { Phone } from 'lucide-react';

interface SocialLink {
  icon: React.ElementType;
  href: string;
  label: string;
  hoverColor: string;
}

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: Instagram,
    href: 'https://www.instagram.com/sy_jewelry_display?igsh=c3NjeWE3eWo1Nmt1&utm_source=qr',
    label: 'Instagram',
    hoverColor: 'hover:text-[#E4405F]'
  },
  {
    icon: Facebook,
    href: 'https://www.facebook.com/share/18mgaEiU3F/?mibextid=wwXIfr',
    label: 'Facebook',
    hoverColor: 'hover:text-[#1877F2]'
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/hh-h-25b090324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
    label: 'LinkedIn',
    hoverColor: 'hover:text-[#0A66C2]'
  },
  {
    icon: FaXTwitter,
    href: 'https://x.com/huanghaoi?s=21',
    label: 'X',
    hoverColor: 'hover:text-black'
  },
  {
    icon: FaPinterest,
    href: 'https://pin.it/1qCGptEGP',
    label: 'Pinterest',
    hoverColor: 'hover:text-[#E60023]'
  },
  {
    icon: Phone,
    href: 'https://wa.me/message/NTCKA6CYXCIFN1',
    label: 'WhatsApp',
    hoverColor: 'hover:text-[#25D366]'
  },
  {
    icon: Mail,
    href: 'mailto:SYJewelryDisplay@outlook.com',
    label: 'Email',
    hoverColor: 'hover:text-[#EA4335]'
  }
];

const STORE_URL = 'https://store.flylinking.com/s/2UPEH35FWO';

const FOOTER_LINKS: FooterSection[] = [
  {
    title: 'About',
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'Contact Us', href: '/contact' }
    ]
  },
  {
    title: 'Products',
    links: [
      { 
        label: 'Display Props', 
        href: STORE_URL,
        external: true 
      },
      { 
        label: 'Display Stands', 
        href: STORE_URL,
        external: true 
      },
      { 
        label: 'Bust', 
        href: STORE_URL,
        external: true 
      }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Info */}
          <div>
            <h3 className="text-xl font-playfair mb-4">SY Jewelry Display</h3>
            <p className="text-gray-600 mb-6">
              Creating distinctive jewelry display props and accessories. 
              Specializing in professional display solutions for jewelry presentation.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 ${item.hoverColor} transition-colors`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Lists */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h4 className="font-medium mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} SY Jewelry Display. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 