'use client';

import { formatDistance } from 'date-fns';
import Link from 'next/link';

export default function FileItem(props) {
  const { title, thumbnail, lastUpdate, users } = props;

  return (
    <Link href="/files/untitled">
      <div className="item-workspace cursor-pointer">
        <div className="aspect-video w-full rounded-md bg-gray-300" />
        <p className="mt-2">{title ?? 'Untitled'}</p>
        {lastUpdate}
        <p className="text-xs text-muted-foreground">
          Edited{' '}
          {lastUpdate
            ? formatDistance(lastUpdate, new Date(), {
                addSuffix: true,
              })
            : ''}
        </p>
      </div>
    </Link>
  );
}
