'use client';

import { useOnMountUnsafe } from '@/hook/useOnMountUnsafe';
import useAuthService from '@/services/auth.service';
import { setUser } from '@/store/user.store';
import { getAccessToken } from '@/utils/cookie-service.utils';
import { redirect } from 'next/navigation';
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function LayoutFiles({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getAccessToken();
  const dispatch = useDispatch();

  const { getMe } = useAuthService();

  useLayoutEffect(() => {
    if (!token) {
      redirect('/auth');
    }
  }, []);

  const fetchMe = async () => {
    const { data: dataMe } = await getMe();
    dispatch(setUser(dataMe?.getMe.user));
  };

  useOnMountUnsafe(() => {
    fetchMe();
  });

  return <>{children}</>;
}
