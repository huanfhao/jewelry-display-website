'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

export default function RouteChangeProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ 
      showSpinner: false,
      minimum: 0.3,
      easing: 'ease',
      speed: 200
    });
  }, []);

  useEffect(() => {
    NProgress.start();
    // 添加延迟以显示进度条动画
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  return null;
} 