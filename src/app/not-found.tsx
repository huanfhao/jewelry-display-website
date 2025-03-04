import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react'

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto px-4 py-12">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-playfair mb-4">404</h1>
            <h2 className="text-2xl mb-6">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Link href="/">
              <Button>
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Suspense>
  );
} 