import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-6 text-center">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="inline-block">
        <Button>
          Back to Home
        </Button>
      </Link>
    </div>
  );
} 