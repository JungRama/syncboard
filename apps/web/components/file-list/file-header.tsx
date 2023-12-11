'use client';

import { mutateCreateFile } from '@/services/file.service';
import { Button } from '@ui/components/ui/button';
import { Grid, List, Loader, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FileHeader() {
  const router = useRouter();
  const [createFile, { loading }] = mutateCreateFile();

  const createNewFile = async () => {
    const response = await createFile();
    const fileId = response.data?.createFile.id;

    if (fileId) {
      router.push(`/files/${fileId}`);
    }
  };

  return (
    <div className="flex justify-between gap-1 px-3 py-3">
      <div>
        <Button className="block px-2 md:hidden" variant="secondary">
          <Menu className="h-5 text-muted-foreground" />
        </Button>
      </div>

      <div className="flex justify-end gap-1">
        <Button onClick={createNewFile}>
          {loading && <Loader className="h-4 animate-spin"></Loader>} + Files
        </Button>

        <Button className="hidden px-2 md:block" variant="secondary">
          <Grid className="h-5" />
        </Button>
        <Button className="hidden px-2 md:block" variant="secondary">
          <List className="h-5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
