interface CountryStatsSkeletonProps {
  count?: number;
}

export default function CountryStatsSkeleton({ count = 3 }: CountryStatsSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 dark:bg-gray-700"></div>
              <div className="h-3 bg-gray-200 rounded w-24 mt-2 dark:bg-gray-700"></div>
            </div>
          </div>
          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="h-2 w-full max-w-[100px] bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-4 w-8 bg-gray-200 rounded dark:bg-gray-700"></div>
          </div>
        </div>
      ))}
    </>
  );
} 