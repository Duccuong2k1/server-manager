"use client"
import { TimeRangeType, useServerStats } from '@/hooks/useServerStats';
import React, { useMemo, useState } from 'react';

import { formatDate } from '@/lib/helpers/parser';


import { FaApple, FaDesktop, FaLinux, FaServer, FaWindows } from 'react-icons/fa';
import { SiArchlinux } from 'react-icons/si';
import AnalyticsChart from './components/AnaliticsChart';
import StatsGrid from './components/StatGrid';
import TimeRangeFilter from './components/TimeRangeFilter';

export type TimeRangeTypeUI = '24h' | '7d' | '30d' | 'custom';

const getTop = (counts: Record<string, number>, top = 3) => {
  return Object.entries(counts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, top);
};


  
const mapPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'linux':
      return <FaLinux className="w-3 h-3 text-gray-400" />;
    case 'windows':
      return <FaWindows className="w-3 h-3 text-gray-400" />;
    case 'macos':
      return <FaApple className="w-3 h-3 text-gray-400" />;
    default:
      return <FaDesktop className="w-3 h-3 text-gray-400" />;
  }
};

  const createPlatformStats = (stats:any) => {


  return [
   {
      title: 'Tổng số lượng máy chủ',
      value: stats?.totalServers ?? 0,
      change: '+0%',
      changeType: 'increase' as const,
      icon: <FaServer className="w-6 h-6 text-gray-400" />,
    },
    {
      title: 'Số lượng máy chủ mới',
      value: stats?.newServersCount ?? 0,
      change: `${stats?.filterStart && stats?.filterEnd ? 
        `${formatDate(stats.filterStart, "date")} - ${formatDate(stats.filterEnd, "date")}` : ''}`,
      changeType: 'increase' as const,
      icon: <FaServer className="w-6 h-6 text-green-400" />,
    },
    {
      title: 'Top nền tảng (Platform)',
      value: '',
      change: '',
      changeType: 'increase' as const,
      listItems: getTop(stats?.platformCounts ?? {}).map(([platform, count]) => ({
        label: platform,
        value: count,
        percentage: Math.round((count / (stats?.totalServers || 1)) * 100),
        icon: mapPlatformIcon(platform),
      })),
    },
    {
      title: 'Top hệ điều hành (OS)',
      value: '',
      change: '',
      changeType: 'increase' as const,
      listItems: getTop(stats?.countryCounts ?? {}).map(([os, count]) => ({
        label: os,
        value: count,
        percentage: Math.round((count / (stats?.totalServers || 1)) * 100),
        icon: <FaDesktop className="w-3 h-3 text-gray-400" />,
      })),
    },
    {
      title: 'Top kiến trúc (Arch)',
      value: '',
      change: '',
      changeType: 'increase' as const,
      listItems: getTop(stats?.archCounts ?? {}).map(([arch, count]) => ({
        label: arch,
        value: count,
        percentage: Math.round((count / (stats?.totalServers || 1)) * 100),
        icon: <SiArchlinux className="w-3 h-3 text-gray-400" />,
      })),
    },
  ];
};


export default function ServerStatistics() {
  const [timeRange, setTimeRange] = useState<TimeRangeTypeUI>('24h');
  const [customStart, setCustomStart] = useState<Date | null>(null);
  const [customEnd, setCustomEnd] = useState<Date | null>(null);

  const effectiveTimeRange = React.useMemo<TimeRangeType>(() => {
    if (timeRange === 'custom' && customStart && customEnd) {
      return { start: customStart, end: customEnd };
    }
    return timeRange as TimeRangeType;
  }, [timeRange, customStart, customEnd]);

  const { stats, loading, error } = useServerStats(effectiveTimeRange);
  const platformStats = useMemo(() => createPlatformStats(stats), [stats]);
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
     
       <TimeRangeFilter
          activeTimeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          customStart={customStart}
          customEnd={customEnd}
          onCustomStartChange={setCustomStart}
          onCustomEndChange={setCustomEnd}
        />
      
      </div>
        <StatsGrid stats={platformStats}  />
    

        <AnalyticsChart stats={stats} loading={loading}/>
    </div>
  );
}