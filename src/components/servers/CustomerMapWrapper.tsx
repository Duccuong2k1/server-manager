"use client";
import { useServerStats } from "@/hooks/useServerStats";
import CountryStatsSkeleton from "./CountryStatsSkeleton";
import ServerMapBox from "./ServerMapBox";

export default function CustomerMapWrapper() {
  const { stats, loading } = useServerStats();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Server Distribution
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Số lượng server theo quốc gia
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 overflow-hidden border border-gary-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <ServerMapBox />
        </div>
        <div className="col-span-1">
          <div className="space-y-5">
            {loading ? (
              <CountryStatsSkeleton count={5} />
            ) : stats?.countryStats ? (
              stats.countryStats.slice(0, 5).map((stat) => (
                <div key={stat.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                        {stat.country}
                      </p>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {stat.count} Servers
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full max-w-[140px] items-center gap-3">
                    <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                      <div 
                        className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {stat.percentage}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
