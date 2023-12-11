export default function FileSkeleton() {
  return (
    <div className="animate-pulse cursor-pointer">
      <div className="aspect-video w-full rounded-md bg-gray-300" />
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex w-full flex-col gap-1">
          <div className="h-4 w-full rounded bg-gray-300"></div>
          <div className="h-4 w-[50%] rounded bg-gray-300"></div>
        </div>
        <div className="flex">
          <div className="h-8 w-8 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
