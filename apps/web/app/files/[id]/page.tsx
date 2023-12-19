'use client';

import FileAIDialog from '@/components/file-workspace/file-ai-dialog';
import FileShareDialog from '@/components/file-workspace/file-share-dialog';
import FileWorkspaceHeader from '@/components/file-workspace/file-workspace-header';
import Whiteboard from '@/components/file-workspace/whiteboard';
import { getFileById, mutateUpdateFile } from '@/services/file.service';
import { RootState } from '@/store/index.store';
import { Loader } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { GetFileByIdQuery } from '@/codegen/graphql';

export default function Page({ params }): JSX.Element {
  const { id: roomId } = params;
  const userData = useSelector((state: RootState) => state.user?.user);

  const getData = getFileById(roomId);
  const dataFile = getData.data?.getFileById;
  const [users, setUsers] = useState(dataFile?.userAccess);
  const [isUserHaveAccess, setIsUserHaveAccess] = useState(false);
  const [isUserReadOnly, setIsUserReadOnly] = useState(true);

  useEffect(() => {
    if (!getData.loading) {
      const usersAccess = dataFile?.userAccess ?? [];
      const checkCurrentUserAccess = usersAccess?.find(
        (item) => item.userId._id === userData?.id,
      );
      const checkCurrentUserHaveAccess = !!checkCurrentUserAccess;

      setIsUserReadOnly(checkCurrentUserAccess?.role === 'VIEW');

      setUsers(usersAccess);

      setIsUserHaveAccess(() => {
        return checkCurrentUserHaveAccess;
      });

      if (!checkCurrentUserHaveAccess) {
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
      <div className="z-20">
        <FileWorkspaceHeader
          name={dataFile?.name ?? ''}
          users={users ?? []}
          roomId={roomId}
          shareComponent={
            <FileShareDialog
              roomId={roomId}
              users={users ?? []}
              onUserAccessChange={(updatedUsers) => setUsers(updatedUsers)}
            ></FileShareDialog>
          }
          aiComponent={<FileAIDialog></FileAIDialog>}
        />
      </div>

      <div className="relative z-10 h-[calc(100vh-60px)]">
        <Whiteboard
          roomId={roomId}
          defaultValue={dataFile?.whiteboard}
          isReadOnly={isUserReadOnly}
        ></Whiteboard>
      </div>
    </div>
  );
}
