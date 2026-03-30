import { Skeleton } from "../ui/Skeleton";

export function BoardDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-[1600px] mx-auto w-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-1 pb-2 border-b border-slate-100 mb-2">
        <div className="flex items-start gap-4">
          <Skeleton variant="avatar" className="mt-1" />
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" className="w-48 h-7" />
            <Skeleton variant="text" className="w-80 h-4" />
            <div className="flex gap-6 mt-1">
              <Skeleton variant="text" className="w-20 h-4" />
              <Skeleton variant="text" className="w-20 h-4" />
            </div>
          </div>
        </div>
        <Skeleton variant="button" className="mt-4 sm:mt-0" />
      </div>
      <div className="flex gap-6 min-h-[180px]">
        <Skeleton variant="card" className="w-80" />
        <Skeleton variant="card" className="w-80" />
        <Skeleton variant="card" className="w-80" />
      </div>
    </div>
  );
}
