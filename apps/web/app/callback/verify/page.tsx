'use client';

import { useOnMountUnsafe } from '@/hook/useOnMountUnsafe';
import useAuthService from '@/services/auth.service';
import { setUser } from '@/store/user.store';
import { setAccessToken, setRefreshToken } from '@/utils/cookie-service.utils';
import { useToast } from '@ui/components/ui/use-toast';
import { Loader } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';

export default function GithubCallback(): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const {
    mutateVerifyAccount,
    errorVerifyAccount,

    getMe,
  } = useAuthService();

  const verifyAccountCode = async () => {
    const { data: verify } = await mutateVerifyAccount({
      variables: {
        input: {
          id: searchParams.get('code') as string,
        },
      },
      onError: () => {
        router.push('/auth');
      },
    });

    if (!errorVerifyAccount && verify?.verifyAccount?.access_token) {
      setAccessToken(verify?.verifyAccount.access_token);
      setRefreshToken(verify?.verifyAccount.refresh_token);

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
    verifyAccountCode();
  });

  return (
    <div className="flex h-[100vh] w-full items-center justify-center">
      <Loader className="animate-spin"></Loader>
    </div>
  );
}
