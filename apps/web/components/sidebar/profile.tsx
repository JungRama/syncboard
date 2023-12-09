'use client';

import { Button } from '@ui/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/index.store';
import useAuthService from '@/services/auth.service';
import {
  removeAccessToken,
  removeRefreshToken,
} from '@/utils/cookie-service.utils';
import { setUser } from '@/store/user.store';
import { useRouter } from 'next/navigation';
import { initialName, userProfile } from '@/utils/user-profile.utils';

export default function Profile() {
  const userData = useSelector((state: RootState) => state.user?.user);
  const dispatch = useDispatch();

  const { logout, loadingLogout, errorLogout } = useAuthService();

  const logoutAction = () => {
    logout();
    removeAccessToken();
    removeRefreshToken();
    dispatch(setUser(null));
    window.location.href = '/auth';
  };

  return (
    <div className="mx-3 my-3 flex items-center justify-between">
      {userData && (
        <>
          <div className="flex w-full items-center justify-start gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={userProfile(userData?.photo, initialName(userData.name))}
              ></AvatarImage>
              <AvatarFallback className="text-[10px]">
                {initialName(userData.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{userData?.name}</span>
          </div>

          <Button
            className="h-8 w-8 rounded-full px-2"
            variant="secondary"
            onClick={logoutAction}
          >
            <LogOut className="h-4" />
          </Button>
        </>
      )}
    </div>
  );
}
