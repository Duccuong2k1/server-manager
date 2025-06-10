"use client"
import React, { useState, useEffect } from 'react';
import { useServerStats, TimeRangeType } from '@/hooks/useServerStats';
import ComponentCard from '../common/ComponentCard';
import SkeletonBox from '../common/SkeletonBox';
import DatePicker from '../form/date-picker';
import { formatDate } from '@/lib/helpers/parser';


export type TimeRangeTypeUI = '24h' | '7d' | '30d' | 'custom';

const getTop = (counts: Record<string, number>, top = 3) => {
  return Object.entries(counts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, top);
};

const timeOptions = [
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last week', value: '7d' },
  { label: 'Last month', value: '30d' },
  { label: 'Custom', value: 'custom' },
];

export default function ServerStatistics() {
  const [timeRange, setTimeRange] = useState<TimeRangeTypeUI>('24h');
  const [customStart, setCustomStart] = useState<Date | null>(null);
  const [customEnd, setCustomEnd] = useState<Date | null>(null);


  const effectiveTimeRange = React.useMemo<TimeRangeType>(() => {
    if (timeRange === 'custom' && customStart && customEnd) {
      return {
        start: customStart,
        end: customEnd
      };
    }
    return timeRange as TimeRangeType;
  }, [timeRange, customStart, customEnd]);

  const { stats, loading, error } = useServerStats(effectiveTimeRange);

  
  useEffect(() => {
    if (timeRange !== 'custom') {
      setCustomStart(null);
      setCustomEnd(null);
    }
  }, [timeRange]);

  if (error) return <div className="text-red-500">Error: {error}</div>;


  const totalServersBox = loading ? (
    <SkeletonBox />
  ) : (
    <div className="text-3xl font-bold text-blue-600">{stats?.totalServers ?? 0}</div>
  );

  const newServersBox = loading ? (
    <SkeletonBox />
  ) : (
    <>
      <div className="text-3xl font-bold text-green-600">{stats?.newServersCount ?? 0}</div>
      {stats?.filterStart && stats?.filterEnd && (
        <div className="text-xs text-gray-500 mt-1">
          {`Từ ${formatDate(stats.filterStart , "date")} đến ${formatDate(stats.filterEnd, "date")}`}
        </div>
      )}
    </>
  );

  const topPlatformBox = loading ? (
    <SkeletonBox />
  ) : (
    <ul>
      {getTop(stats?.platformCounts ?? {}, 3).map(([platform, count]) => (
        <li key={platform} className="flex justify-between text-gray-900 dark:text-white">
          <span>{platform}</span>
          <span className="font-semibold">{count}</span>
        </li>
      ))}
    </ul>
  );

  const topOSBox = loading ? (
    <SkeletonBox />
  ) : (
    <ul>
      {getTop(stats?.countryCounts ?? {}, 3).map(([os, count]) => (
        <li key={os} className="flex justify-between text-gray-900 dark:text-white">
          <span>{os}</span>
          <span className="font-semibold">{count}</span>
        </li>
      ))}
    </ul>
  );

  const topArchBox = loading ? (
    <SkeletonBox />
  ) : (
    <ul>
      {getTop(stats?.archCounts ?? {}, 3).map(([arch, count]) => (
        <li key={arch} className="flex justify-between text-gray-900 dark:text-white">
          <span>{arch}</span>
          <span className="font-semibold">{count}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        {timeOptions.map(opt => (
          <button
            key={opt.value}
            className={`px-3 py-1 rounded border ${
              timeRange === opt.value 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } transition`}
            onClick={() => setTimeRange(opt.value as TimeRangeTypeUI)}
          >
            {opt.label}
          </button>
        ))}
        {timeRange === 'custom' && (
          <div className="flex gap-4">
            <DatePicker
              label="Start date"
              id="startDate"
              defaultDate={customStart ? formatDate(customStart, "datetime") : ''}
              onChange={(dates, dateString) => {
                const date = dateString ? new Date(dateString) : null;
                setCustomStart(date);
             
                if (customEnd && date && customEnd < date) {
                  setCustomEnd(null);
                }
              }}
            />
            <DatePicker
              label="End date"
              id="endDate"
              defaultDate={customEnd ? formatDate(customEnd, "datetime") : ''}
              onChange={(dates, dateString) => {
                const date = dateString ? new Date(dateString) : null;
                setCustomEnd(date);
              }}
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <ComponentCard title="Tổng số lượng máy chủ">
          {totalServersBox}
        </ComponentCard>
        <ComponentCard title="Số lượng máy chủ mới">
          {newServersBox}
        </ComponentCard>
        <ComponentCard title="Top nền tảng (Platform)">
          {topPlatformBox}
        </ComponentCard>
        <ComponentCard title="Top hệ điều hành (OS)">
          {topOSBox}
        </ComponentCard>
        <ComponentCard title="Top kiến trúc hệ thống (Arch)">
          {topArchBox}
        </ComponentCard>
      </div>
    </div>
  );
}