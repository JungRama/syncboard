import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/components/ui/dialog';

import { Button } from '@ui/components/ui/button';
import { Link, ShareIcon } from 'lucide-react';
import { Input } from '@ui/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar';
import { Separator } from '@ui/components/ui/separator';

export default function FileShareDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          <ShareIcon className="h-4"></ShareIcon>
          <p>Share</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <Input placeholder="Enter email" type="email"></Input>
          <Select value="view">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="view">Can View</SelectItem>
              <SelectItem value="edit">Can Edit</SelectItem>
            </SelectContent>
          </Select>
          <Button>Invite</Button>
        </div>
        <hr className="border-gray-200" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm">Jung Rama</p>
              <p className="text-xs text-muted-foreground">Owner</p>
            </div>
          </div>
          <div>
            <Select value="view">
              <SelectTrigger className="border-0 p-0 shadow-none focus:border-0 focus:outline-none">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">Can View</SelectItem>
                <SelectItem value="edit">Can Edit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <hr className="border-gray-200" />
        <div className="flex w-[90px] cursor-pointer text-xs font-medium text-blue-700">
          <Link className="h-4"></Link> Copy Link
        </div>
      </DialogContent>
    </Dialog>
  );
}
