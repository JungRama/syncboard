import { Button } from '@ui/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar';
import { LogOut } from 'lucide-react';

export default function Profile() {
  return (
    <div className="mx-3 my-3 flex items-center justify-between">
      <div className="flex w-full items-center justify-start gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-sm">Jung Rama</span>
      </div>

      <Button className="rounded-full px-2" variant="secondary">
        <LogOut className="h-4" />
      </Button>
    </div>
  );
}
