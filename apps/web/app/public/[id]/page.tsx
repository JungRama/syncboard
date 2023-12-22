'use client';

import Whiteboard from '@/components/file-workspace/whiteboard';
import { getFileById } from '@/services/file.service';
import { Loader } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useEffect } from 'react';

export default function Page({ params }): JSX.Element {
  const { id: roomId } = params;

  const getData = getFileById(roomId, true);
  const dataFile = getData.data?.getFileById;

  useEffect(() => {
    if (!getData.loading) {
      if (!getData.data?.getFileById.isPublic) {
        notFound();
      }
    }
  }, [getData.loading]);

  if (getData.loading) {
    return (
      <div className="flex h-[100vh] w-full items-center justify-center">
        <Loader className="animate-spin"></Loader>
      </div>
    );
  }

  return (
    <div className="h-[100vh]">
      <div className="relative z-10 h-[100vh]">
        <Whiteboard
          roomId={roomId}
          defaultValue={dataFile?.whiteboard}
          isReadOnly={true}
        ></Whiteboard>
      </div>
    </div>
  );
}
