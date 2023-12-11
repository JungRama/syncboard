'use client';

import { initialName, userProfile } from '@/utils/user-profile.utils';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar';
import { formatDistance } from 'date-fns';
import Link from 'next/link';

export default function FileItem(props) {
  const { title, thumbnail, id, lastUpdate, users } = props;

  return (
    <Link href={`/files/${id}`}>
      <div className="item-workspace cursor-pointer">
        <div className="aspect-video w-full rounded-md bg-gray-300" />
        <div className="flex items-center justify-between">
          <div>
            <p className="mt-2">{title ?? 'Untitled'}</p>
            <p className="text-xs text-muted-foreground">
              Edited{' '}
              {lastUpdate
                ? formatDistance(new Date(lastUpdate), new Date(), {
                    addSuffix: true,
                  })
                : 'a while ago'}
            </p>
          </div>
          <div>
            <div className="flex">
              {users.map((item) => {
                const user = item.userId;

                return (
                  <div className="-mr-[20px] rounded-full border-[2px] last:mr-[0px] hover:z-10 hover:border-[#000]">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userProfile(user?.photo, initialName(user.name))}
                      ></AvatarImage>
                      <AvatarFallback className="text-[10px]">
                        {initialName(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
