import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h2 className="text-2xl font-semibold mb-4">页面未找到</h2>
      <p className="text-gray-600 mb-6 text-center">
        抱歉，您访问的页面不存在。
      </p>
      <Button asChild>
        <Link href="/">
          返回首页
        </Link>
      </Button>
    </div>
  );
} 