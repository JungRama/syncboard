import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar';
import { Button } from '@ui/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/components/ui/tooltip';
import { ArrowLeft, ShareIcon } from 'lucide-react';
import Link from 'next/link';
import ContentEditable from 'react-contenteditable';
import FileShareDialog from './file-share-dialog';

export default function FileWorkspaceHeader() {
  return (
    <div className="flex items-center justify-between gap-1 px-3 py-3">
      <div className="flex items-center gap-3">
        <Link href={'/files'}>
          <ArrowLeft></ArrowLeft>
        </Link>
        <ContentEditable
          html={'Untitled Files'}
          tagName="h1"
          onChange={() => {}}
          className="inline-block cursor-text border-b-2 border-transparent bg-transparent text-xl font-medium focus:border-b-2 focus:border-white focus:outline-none" // Use a custom HTML tag (uses a div by default)
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent className="z-50">
                <p>Jung Rama</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <FileShareDialog></FileShareDialog>
      </div>
    </div>
  );
}
