import FileHeader from '@/components/file-list/file-header';
import FileItem from '@/components/file-list/file-item';
import Sidebar from '@/components/sidebar';
import { Separator } from '@ui/components/ui/separator';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
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
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3"
              >
                <FileItem></FileItem>
              </div>
            ))}
          </div>
        </div>
        {children}
      </section>
    </div>
  );
}
