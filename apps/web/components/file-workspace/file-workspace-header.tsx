'use client';

import { GetFileByIdQuery } from '@/codegen/graphql';
import { ArrowLeft, Loader } from 'lucide-react';
import Link from 'next/link';
import ContentEditable from 'react-contenteditable';
import FileShareDialog from './file-share-dialog';
import FileUserOwner from './file-user-owner';
import _ from 'underscore';
import { mutateUpdateFile } from '@/services/file.service';
import { useState } from 'react';
import FileAIDialog from './file-ai-dialog';

export default function FileWorkspaceHeader({
  name,
  users,
  roomId,
}: {
  name: string;
  users: GetFileByIdQuery['getFileById']['userAccess'];
  roomId: string;
}) {
  const [nameFile, setNameFile] = useState(name);
  const [updateFile, { loading }] = mutateUpdateFile();

  const actionNameChange = _.debounce((value: string) => {
    if (value === '' || !value) {
      value = 'Untitled';
    }

    setNameFile(value);

    updateFile({
      variables: {
        input: {
          id: roomId,
          name: value,
        },
      },
    });
  }, 1000);

  return (
    <div className="z-20 flex items-center justify-between gap-1 px-3 py-3">
      <div className="flex items-center gap-3">
        <Link href={'/files'}>
          <ArrowLeft></ArrowLeft>
        </Link>
        <ContentEditable
          html={nameFile}
          tagName="h1"
          onChange={(event) => {
            actionNameChange(event.target.value);
          }}
          className="inline-block cursor-text border-b-2 border-transparent bg-transparent text-xl font-medium focus:border-b-2 focus:border-white focus:outline-none" // Use a custom HTML tag (uses a div by default)
        />
        {loading && <Loader className="h-4 w-4 animate-spin"></Loader>}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-[2px]">
          {users.map((item) => {
            const user = item.userId;

            return (
              <FileUserOwner
                key={user?._id}
                name={user?.name ?? ''}
                photo={user?.photo}
              ></FileUserOwner>
            );
          })}
        </div>

        <FileAIDialog></FileAIDialog>
        <FileShareDialog users={users}></FileShareDialog>
      </div>
    </div>
  );
}
