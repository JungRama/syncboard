'use client';
import FileWorkspaceHeader from '@/components/file-workspace/file-workspace-header';
import Whiteboard from '@/components/file-workspace/whiteboard';

export default function Page(): JSX.Element {
  return (
    <div className="h-[100vh]">
      <FileWorkspaceHeader />

      <div className="z-10 h-[calc(100vh-60px)]">
        <Whiteboard></Whiteboard>
      </div>
    </div>
  );
}
