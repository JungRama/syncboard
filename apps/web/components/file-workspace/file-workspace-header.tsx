'use client';

import { GetFileByIdQuery } from '@/codegen/graphql';
import { ArrowLeft, Dot, Loader, Menu, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import ContentEditable from 'react-contenteditable';
import FileShareDialog from './file-share-dialog';
import FileUserOwner from './file-user-owner';
import _ from 'underscore';
import { mutateUpdateFile } from '@/services/file.service';
import { useState } from 'react';
import FileAIDialog from './file-ai-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu';

export default function FileWorkspaceHeader({
  name,
  users,
  roomId,
  isReadOnly,
  shareComponent,
  aiComponent,
}: {
  name: string;
  users: GetFileByIdQuery['getFileById']['userAccess'];
  roomId: string;
  isReadOnly: boolean;
  shareComponent: JSX.Element;
  aiComponent: JSX.Element;
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
          disabled={loading || isReadOnly}
          tagName="h1"
          onChange={(event) => {
            actionNameChange(event.target.value);
          }}
          className="inline-block cursor-text border-b-2 border-transparent bg-transparent text-xl font-medium focus:border-b-2 focus:border-white focus:outline-none" // Use a custom HTML tag (uses a div by default)
        />
        {loading && <Loader className="h-4 w-4 animate-spin"></Loader>}
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="block md:hidden">
            <MoreHorizontal></MoreHorizontal>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-3 flex flex-col gap-2 p-2">
            <p className="text-xs">Users</p>
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

            {!isReadOnly && aiComponent}
            {shareComponent}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden md:flex md:items-center md:gap-2">
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

          {!isReadOnly && aiComponent}
          {shareComponent}
        </div>
      </div>
    </div>
  );
}
