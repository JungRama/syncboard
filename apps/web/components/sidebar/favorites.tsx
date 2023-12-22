'use client';

import { getFavorites } from '@/services/file.service';
import { Button } from '@ui/components/ui/button';
import { Heart, PenTool } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setFavorites } from '@/store/file.store';

export default function Favorites() {
  const dispatch = useDispatch();
  const favorites = useSelector((state: any) => state.file.favorites);

  const { data: dataFavorites, loading: loadingFavorites } = getFavorites();

  useEffect(() => {
    if (!loadingFavorites) {
      dispatch(setFavorites(dataFavorites?.getFavorites));
    }
  }, [dataFavorites]);

  return (
    <>
      <div className="mx-3 mb-2 mt-3">
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          <p className="text-xs font-bold">Favorites</p>
        </div>
      </div>

      <div>
        {favorites &&
          favorites.map((file) => (
            <Button
              className="flex w-full justify-start gap-2 rounded-none px-3"
              variant="ghost"
              asChild
            >
              <Link href={`/files/${file?.id}`}>
                <PenTool className="h-5 w-5 rounded-sm bg-blue-600 p-1 text-white" />
                <p className="text-xs">{file?.name}</p>
              </Link>
            </Button>
          ))}
      </div>
    </>
  );
}
