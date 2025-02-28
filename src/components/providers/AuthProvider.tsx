'use client';

import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import { Toaster } from 'sonner';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useNavigationLoading();

  return (
    <>
      {children}
      <Toaster richColors position="top-center" />
    </>
  );
} 