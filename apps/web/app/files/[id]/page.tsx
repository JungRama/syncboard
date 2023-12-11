'use client';
import FileWorkspaceHeader from '@/components/file-workspace/file-workspace-header';
import Whiteboard from '@/components/file-workspace/whiteboard';
import { getFileById, mutateUpdateFile } from '@/services/file.service';
import { RootState } from '@/store/index.store';
import { useQuery } from '@apollo/client';
import { Loader } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function Page({ params }): JSX.Element {
  const { id: roomId } = params;
  const userData = useSelector((state: RootState) => state.user?.user);

  const getData = getFileById(roomId);

  if (getData.loading) {
    return (
      <div className="flex h-[100vh] w-full items-center justify-center">
        <Loader className="animate-spin"></Loader>
      </div>
    );
  }

  const dataFile = getData.data?.getFileById;
  const users = dataFile?.userAccess;

  const isUserHaveAccess = users?.find(
    (item) => item.userId._id === userData?.id,
  );

  if (!dataFile || !isUserHaveAccess) {
    notFound();
  }

  return (
    <div className="h-[100vh]">
      <div className="z-20">
        <FileWorkspaceHeader
          name={dataFile?.name ?? ''}
          users={users ?? []}
          roomId={roomId}
        />
      </div>

      <div className="relative z-10 h-[calc(100vh-60px)]">
        <Whiteboard
          roomId={roomId}
          defaultValue={dataFile?.whiteboard}
        ></Whiteboard>
      </div>
    </div>
  );
}
