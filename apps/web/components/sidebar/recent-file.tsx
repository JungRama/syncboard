import { Button } from '@ui/components/ui/button';
import { Clock, PenTool } from 'lucide-react';

export default function RecentFile() {
  return (
    <>
      <div className="mx-3 mb-2 mt-3">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <p className="text-xs font-bold">Recent Files</p>
        </div>
      </div>

      <div>
        <Button
          className="flex w-full justify-start gap-2 rounded-none px-3"
          variant="ghost"
        >
          <PenTool className="h-5 w-5 rounded-sm bg-blue-600 p-1 text-white" />
          <p className="text-xs">Base UI Kit</p>
        </Button>
      </div>
    </>
  );
}
