'use client';

import { Button } from '@ui/components/ui/button';
import { Avatar, AvatarImage } from '@ui/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index.store';

export default function Profile() {
  const userData = useSelector((state: RootState) => state.user?.user);

  return (
    <div className="mx-3 my-3 flex items-center justify-between">
      {userData && (
        <>
          <div className="flex w-full items-center justify-start gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
            <span className="text-sm">{userData.name}</span>
          </div>

          <Button className="h-8 w-8 rounded-full px-2" variant="secondary">
            <LogOut className="h-4" />
          </Button>
        </>
      )}
    </div>
  );
}
