'use client';

import { mutateCreateFile } from '@/services/file.service';
import { setFileItemView } from '@/store/file.store';
import { RootState } from '@/store/index.store';
import { toogleSidebar } from '@/store/navigation.store';
import { Button } from '@ui/components/ui/button';
import { useToast } from '@ui/components/ui/use-toast';
import { cn } from '@ui/lib/utils';
import { Grid, List, Loader, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function FileHeader() {
  const router = useRouter();
  const [createFile, { loading, error }] = mutateCreateFile();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const fileItemView = useSelector(
    (state: RootState) => state.file.fileItemView,
  );

  const createNewFile = async () => {
    const response = await createFile();

    const fileId = response.data?.createFile.id;

    if (fileId) {
      setTimeout(() => {
        router.push(`/files/${fileId}`);
      }, 1000);
    }
  };

  useEffect(() => {
    if (error) {
      toast({ description: error.message, variant: 'destructive' });
    }
  }, [error]);

  return (
    <div className="flex justify-between gap-1 px-3 py-3">
      <div>
        <Button
          className="block px-2 md:hidden"
          variant="secondary"
          onClick={() => dispatch(toogleSidebar())}
        >
          <Menu className="h-5" />
        </Button>
      </div>

      <div className="flex justify-end gap-1">
        <Button onClick={createNewFile}>
          {loading && <Loader className="h-4 animate-spin"></Loader>} + Files
        </Button>

        <Button
          className="hidden px-2 md:block"
          variant="secondary"
          onClick={() => dispatch(setFileItemView('GRID'))}
        >
          <Grid
            className={cn(
              'h-5',
              fileItemView !== 'GRID' && 'text-muted-foreground',
            )}
          />
        </Button>
        <Button
          className="hidden px-2 md:block"
          variant="secondary"
          onClick={() => dispatch(setFileItemView('LIST'))}
        >
          <List
            className={cn(
              'h-5',
              fileItemView !== 'LIST' && 'text-muted-foreground',
            )}
          />
        </Button>
      </div>
    </div>
  );
}
