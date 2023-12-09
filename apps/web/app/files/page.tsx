'use client';

import FileHeader from '@/components/file-list/file-header';
import FileItem from '@/components/file-list/file-item';
import Sidebar from '@/components/sidebar';
import { useOnMountUnsafe } from '@/hook/useOnMountUnsafe';
import useFileService from '@/services/file.service';
import { Separator } from '@ui/components/ui/separator';
import { useEffect } from 'react';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { getFiles, loadingGetFiles, errorGetFiles, dataFiles } =
    useFileService();

  useOnMountUnsafe(() => {
    getFiles();
  });

  return (
    <div className="flex max-h-full">
      <section className="fixed top-0 z-50 h-[100vh] w-64 overflow-auto border-r border-gray-200 bg-white md:sticky md:bg-transparent">
        <Sidebar></Sidebar>
      </section>

      <section className="flex flex-1 flex-col ">
        <FileHeader></FileHeader>

        <Separator />

        <div className="mx-3 my-3">
          <div className="grid grid-cols-12 gap-4">
            {dataFiles?.getFiles.map((item, i) => (
              <div
                key={i}
                className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3"
              >
                <FileItem
                  title={item?.name}
                  thumbnail={item?.thumbnail}
                  lastUpdate={item?.updatedAt}
                  users={item?.userAccess}
                ></FileItem>
              </div>
            ))}
          </div>
        </div>
        {children}
      </section>
    </div>
  );
}
