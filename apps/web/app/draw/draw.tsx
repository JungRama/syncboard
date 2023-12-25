'use client';

import FileAIDialog from '@/components/file-workspace/file-ai-dialog';
import Whiteboard from '@/components/file-workspace/whiteboard';
import { Button } from '@ui/components/ui/button';
import Link from 'next/link';

export default function Draw(): JSX.Element {
  return (
    <div className="h-[100vh]">
      <div className="z-20 flex items-center justify-between gap-1 px-3 py-3">
        <div className="flex items-center">
          <Button asChild>
            <Link href={'/auth'}>Login</Link>
          </Button>
          <p className="ml-2 hidden text-xs md:block">
            Login to use more feature like have <br />{' '}
            <b>multiple whiteboard</b> or <b>share whiteboard in realtime</b>
          </p>
        </div>
        <FileAIDialog></FileAIDialog>
      </div>
      <div className="relative z-10 h-[calc(100vh-60px)]">
        <Whiteboard
          roomId={null}
          useRealtime={false}
          defaultValue={null}
          isReadOnly={false}
        ></Whiteboard>
      </div>
    </div>
  );
}
