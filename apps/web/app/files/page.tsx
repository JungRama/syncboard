'use client';

import FileHeader from '@/components/file-list/file-header';
import FileItem from '@/components/file-list/file-item';
import Sidebar from '@/components/sidebar';
import FileSkeleton from '@/components/skeletons/file-skeleton';
import { getFiles } from '@/services/file.service';
import { RootState } from '@/store/index.store';
import { toogleSidebar } from '@/store/navigation.store';
import { Separator } from '@ui/components/ui/separator';
import { cn } from '@ui/lib/utils';
import { File, FilePlus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

export default function FilePage(): JSX.Element {
  const params = useSearchParams();
  const dispatch = useDispatch();
  const showSidebar = useSelector(
    (state: RootState) => state.navigation.showSidebar,
  );

  const fileItemView = useSelector(
    (state: RootState) => state.file.fileItemView,
  );

  const { data: dataFiles, loading: loadingFiles } = getFiles(
    params.get('search'),
  );

  return (
    <div className="flex max-h-full">
      <section
        className={cn(
          'fixed top-0 z-50 h-[100vh] w-64 overflow-auto border-r border-gray-200 bg-white md:sticky md:block md:bg-transparent',
          showSidebar ? 'block' : 'hidden',
        )}
      >
        <Sidebar></Sidebar>
      </section>
      <div
        onClick={() => {
          dispatch(toogleSidebar());
        }}
        className={cn(
          'sidebar-overlay fixed left-0 top-0 z-20 h-full w-full bg-black opacity-50',
          showSidebar ? 'block' : 'hidden',
        )}
      ></div>

      <section className="flex flex-1 flex-col ">
        <FileHeader></FileHeader>
        <Separator />

        <div className="mx-3 my-3">
          <div className="grid grid-cols-12 gap-4">
            {loadingFiles ? (
              <>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={'loader-file' + i}
                    className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3"
                  >
                    <FileSkeleton></FileSkeleton>
                  </div>
                ))}
              </>
            ) : (
              <>
                {dataFiles?.getFiles.map((item, i) => (
                  <div
                    key={item?.id}
                    className={cn(
                      fileItemView === 'GRID'
                        ? 'col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3'
                        : 'col-span-12 ',
                    )}
                  >
                    <FileItem
                      variant={fileItemView}
                      title={item?.name}
                      id={item?.id}
                      thumbnail={item?.thumbnail}
                      lastUpdate={item?.updatedAt}
                      users={item?.userAccess}
                    ></FileItem>
                  </div>
                ))}

                {dataFiles && dataFiles?.getFiles?.length <= 0 && (
                  <div className="col-span-12 flex h-[80vh] flex-col items-center justify-center">
                    <FilePlus
                      className="h-16 w-16"
                      strokeWidth={1.5}
                    ></FilePlus>
                    <p className="mt-2 text-center text-lg font-bold">
                      No files found
                    </p>
                    <p className="text-gray-500">
                      Get started by creating a new file.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
