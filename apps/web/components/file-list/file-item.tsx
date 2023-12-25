'use client';

import { mutateToogleFavorite } from '@/services/file.service';
import { setFavorites } from '@/store/file.store';
import { initialName, userProfile } from '@/utils/user-profile.utils';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar';
import { cn } from '@ui/lib/utils';
import { formatDistance } from 'date-fns';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

export default function FileItem(props) {
  const dispatch = useDispatch();

  const { variant, title, thumbnail, id, lastUpdate, users } = props;

  const favorites = useSelector((state: any) => state.file.favorites);

  const isFavorite = favorites?.find((item) => item.id === id);

  const [mutateFavorite] = mutateToogleFavorite();

  const toogleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      dispatch(setFavorites(favorites.filter((item) => item.id !== id)));
    } else {
      dispatch(setFavorites([...favorites, { id, name: title }]));
    }

    mutateFavorite({
      variables: {
        input: {
          id,
        },
      },
    });
  };

  return (
    <div
      className={cn(
        'group relative',
        variant === 'LIST' && ' flex w-full items-center gap-2',
      )}
    >
      <div
        className={cn(
          'z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white',
          isFavorite ? 'bg-red-500' : 'bg-gray-400',
          variant === 'GRID' && 'absolute right-4 top-4 ',
          variant === 'GRID' && ' opacity-0 group-hover:opacity-100',
        )}
        onClick={(e) => toogleFavorite(e)}
      >
        <Heart className="h-4" strokeWidth="3"></Heart>
      </div>
      <Link href={`/files/${id}`} className="w-full">
        <div
          className={cn(
            'item-workspace cursor-pointer',
            variant === 'LIST' && 'flex items-center',
          )}
        >
          <div className="relative flex aspect-video items-center justify-center rounded-md bg-[#f0f0f0]">
            <img
              src={process.env.NEXT_PUBLIC_STORAGE_URL + thumbnail}
              className={cn(variant === 'LIST' ? 'h-16 rounded-lg' : 'h-24')}
              alt=""
            />
          </div>

          <div
            className={cn(
              'flex w-full items-center justify-between',
              variant === 'LIST' && 'ml-4',
            )}
          >
            <div>
              <p className={cn(variant === 'GRID' ? 'mt-2' : 'mt-0')}>
                {title ?? 'Untitled'}
              </p>
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
    </div>
  );
}
