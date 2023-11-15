import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Separator } from '@ui/components/ui/separator';
import { Search } from 'lucide-react';
import Favorites from './favorites';
import Profile from './profile';
import RecentFile from './recent-file';

export default function Sidebar() {
  return (
    <>
      <div className="my-3 flex justify-center">
        <Button variant="link">LOGO</Button>
      </div>
      <Separator />

      <Profile></Profile>

      <div className="relative mx-3 my-4">
        <Search className="absolute left-2 top-[50%] h-4 -translate-y-1/2 transform" />
        <Input
          className="w-full max-w-sm pl-10 text-xs"
          placeholder="Search Files ..."
        />
      </div>

      <Separator />

      <RecentFile></RecentFile>

      <Separator className="mt-2" />

      <Favorites></Favorites>
    </>
  );
}
