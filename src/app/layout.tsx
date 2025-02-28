import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import 'nprogress/nprogress.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: {
    default: 'SY Jewelry Display',
    template: '%s | SY Jewelry Display'
  },
  description: 'Exquisite jewelry and unique designs for timeless elegance',
  keywords: ['jewelry', 'luxury', 'design', 'accessories', 'fashion'],
  authors: [{ name: 'SY Jewelry' }],
  creator: 'SY Jewelry',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://syjewelry.com',
    siteName: 'SY Jewelry Display',
    title: 'SY Jewelry Display',
    description: 'Exquisite jewelry and unique designs for timeless elegance',
    images: [
      {
        url: '/images/about.jpg',
        width: 1200,
        height: 630,
        alt: 'SY Jewelry Display'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SY Jewelry Display',
    description: 'Exquisite jewelry and unique designs for timeless elegance',
    images: ['/images/about.jpg']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} ${playfair.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
