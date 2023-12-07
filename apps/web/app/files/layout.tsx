'use client';

import { getAccessToken } from '@/utils/cookie-service.utils';
import { redirect } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default function LayoutFiles({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getAccessToken();

  useLayoutEffect(() => {
    if (!token) {
      redirect('/auth');
    }
  }, []);

  return <>{children}</>;
}
