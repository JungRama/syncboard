'use client';

import useAuthService from '@/services/auth.service';
import { setUser } from '@/store/user.store';
import { setAccessToken, setRefreshToken } from '@/utils/cookie-service.utils';
import { useToast } from '@ui/components/ui/use-toast';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { useOnMountUnsafe } from '@/hook/useOnMountUnsafe';

export default function GithubCallback(): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const {
    mutateOAuth,
    errorOAuth,

    getMe,
  } = useAuthService();

  const continueWithOAuth = async () => {
    const { data: oAuthData } = await mutateOAuth({
      variables: {
        input: {
          code: searchParams.get('code') as string,
          strategy: 'GITHUB',
        },
      },
      onError: () => {
        router.push('/auth');
      },
    });

    if (!errorOAuth && oAuthData?.oAuth?.access_token) {
      setAccessToken(oAuthData.oAuth.access_token);
      setRefreshToken(oAuthData.oAuth.refresh_token);

      const { data: dataMe } = await getMe();

      if (!dataMe) {
        toast({
          title: 'Error',
          description: 'Something went wrong! we could not sign you in',
          variant: 'destructive',
        });
      } else {
        dispatch(setUser(dataMe.getMe.user));
        router.push('/files');
      }
    } else {
      toast({
        title: 'Error',
        description: 'Something went wrong! we could not sign you in',
        variant: 'destructive',
      });
    }
  };

  useOnMountUnsafe(() => {
    continueWithOAuth();
  });

  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <Loader className="animate-spin"></Loader>
    </div>
  );
}
