import { Skeleton } from "../ui/Skeleton";

export function BoardDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 py-4 sm:py-6 max-w-full sm:max-w-[1600px] mx-auto w-full min-w-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-1 pb-2 border-b border-gray-200 mb-2">
        <div className="flex items-start gap-2 sm:gap-4">
          <Skeleton variant="avatar" className="mt-1" />
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" className="w-32 sm:w-48 h-7" />
            <Skeleton variant="text" className="w-40 sm:w-80 h-4" />
            <div className="flex gap-4 sm:gap-6 mt-1">
              <Skeleton variant="text" className="w-14 sm:w-20 h-4" />
              <Skeleton variant="text" className="w-14 sm:w-20 h-4" />
            </div>
          </div>
        </div>
        <Skeleton variant="button" className="mt-3 sm:mt-0 w-full sm:w-auto" />
      </div>
      <div className="flex gap-3 sm:gap-6 min-h-[120px] sm:min-h-[180px] overflow-x-auto">
        <Skeleton variant="card" className="w-48 sm:w-80" />
        <Skeleton variant="card" className="w-48 sm:w-80" />
        <Skeleton variant="card" className="w-48 sm:w-80" />
      </div>
    </div>
  );
}
