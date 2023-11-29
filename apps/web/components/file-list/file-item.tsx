import Link from 'next/link';

export default function FileItem() {
  return (
    <Link href="/files/untitled">
      <div className="item-workspace cursor-pointer">
        <div className="aspect-video w-full rounded-md bg-gray-300" />
        <p className="mt-2">Base UI Kit Master</p>
        <p className="text-xs text-muted-foreground">Edited 1 day ago</p>
      </div>
    </Link>
  );
}
