import { Separator } from '@ui/components/ui/separator'
import { Button } from '@ui/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar'
import { Clock, Grid, Heart, List, LogOut, PenTool, Search } from 'lucide-react'
import { Input } from "@ui/components/ui/input"


export default function WorkspaceLayout({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <div className="grid grid-cols-12">
      <section className="col-span-12 md:col-span-4 lg:col-span-3 xl:col-span-2 min-h-[100vh]">
        <div className="my-3 flex justify-center">
          <Button variant='link'>LOGO</Button>
        </div>
        <Separator />
        
        <div className="flex items-center justify-between my-3 mx-3">
          <div className='flex items-center justify-start gap-2 w-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className='text-sm'>Jung Rama</span>
          </div>

          <Button className='rounded-full px-2' variant='secondary'>
            <LogOut className='h-4'/>
          </Button>
        </div>

        <div className="my-4 relative mx-3">
          <Search className="absolute left-2 h-4 top-[50%] transform -translate-y-1/2"/>
          <Input
            className="max-w-sm pl-10 w-full text-xs"
            placeholder="Search Files ..."
          />
        </div>

        <Separator />

        <div className="mx-3 mt-3 mb-2">
          <div className="flex items-center gap-1">
            <Clock className='h-4 w-4' />
            <p className='text-xs font-bold'>Recent Files</p>
          </div>
        </div>

        <div>
          <Button className='w-full flex justify-start gap-2 rounded-none px-3' variant='ghost'>
            <PenTool className='h-5 w-5 bg-blue-600 text-white p-1 rounded-sm'/>
            <p className='text-xs'>Base UI Kit</p>
          </Button>
        </div>

        <Separator className='mt-2' />

        <div className="mx-3 mt-3 mb-2">
          <div className="flex items-center gap-1">
            <Heart className='h-4 w-4' />
            <p className='text-xs font-bold'>Favorites</p>
          </div>
        </div>

        <div>
          <Button className='w-full flex justify-start gap-2 rounded-none px-3' variant='ghost'>
            <PenTool className='h-5 w-5 bg-blue-600 text-white p-1 rounded-sm'/>
            <p className='text-xs'>Base UI Kit</p>
          </Button>
        </div>
      </section>
      
      <section className="col-span-12 md:col-span-8 lg:col-span-9 xl:col-span-10 lg:border-l">
        <div className="flex justify-end gap-1 py-3 px-3">
          <Button>
            + Workspace
          </Button>
          <Button className='px-2' variant='secondary'>
            <Grid className='h-5'/>
          </Button>
          <Button className='px-2' variant='secondary'>
            <List className='h-5 text-muted-foreground'/>
          </Button>
        </div>
        <Separator />

        <div className="mx-3 my-3">
          <div className="grid grid-cols-12 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="col-span-12 md:col-span-3 lg:col-span-3 xl:col-span-3">
                <div className='item-workspace cursor-pointer'>
                  <div className="h-[200px] w-full bg-gray-300 rounded-md"></div>
                  <p className='mt-2'>Base UI Kit Master</p>
                  <p className='text-xs text-muted-foreground'>Edited 1 day ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {children}
      </section>
    </div>
  )
}