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
    <div className="grid grid-cols-12">
      <section className="col-span-12 min-h-[100vh] md:col-span-4 lg:col-span-3 xl:col-span-2">
        <Sidebar></Sidebar>
      </section>

      <section className="col-span-12 md:col-span-8 lg:col-span-9 lg:border-l xl:col-span-10">
        <FileHeader></FileHeader>

        <Separator />

        <div className="mx-3 my-3">
          <div className="grid grid-cols-12 gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="col-span-12 md:col-span-3 lg:col-span-3 xl:col-span-3"
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
