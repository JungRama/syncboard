'use client';

import { GET_ME_QUERY } from '@/query/auth.gql';
import { setUser } from '@/store/user.store';
import { getAccessToken } from '@/utils/cookie-service.utils';
import { useQuery } from '@apollo/client';
import { Loader } from 'lucide-react';
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

  useLayoutEffect(() => {
    if (!token) {
      redirect('/auth');
    }
  }, []);

  const getMe = useQuery(GET_ME_QUERY);
  dispatch(setUser(getMe.data?.getMe?.user));

  if (getMe.data) {
    return <>{children}</>;
  } else {
    return (
      <div className="flex h-[100vh] w-full items-center justify-center">
        <Loader className="animate-spin"></Loader>
      </div>
    );
  }
}
