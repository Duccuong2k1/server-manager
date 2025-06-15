"use client"
import { TimeRangeType, useServerStats } from "@/hooks/useServerStats"
import React, { useMemo, useState } from "react"

import { formatDate } from "@/lib/helpers/parser"

import { FaApple, FaDesktop, FaLinux, FaServer, FaWindows } from "react-icons/fa"
import { SiArchlinux } from "react-icons/si"
import AnalyticsChart from "./components/AnaliticsChart"
import StatsGrid from "./components/StatGrid"
import TimeRangeFilter from "./components/TimeRangeFilter"
import ServerPieChart from "./ServerPieChart"

export type TimeRangeTypeUI = "24h" | "7d" | "30d" | "custom"

const getTop = (counts: Record<string, number>, top = 3) => {
  return Object.entries(counts || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
}

const mapPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "linux":
      return <FaLinux className="w-3 h-3 text-gray-400" />
    case "windows":
      return <FaWindows className="w-3 h-3 text-gray-400" />
    case "macos":
      return <FaApple className="w-3 h-3 text-gray-400" />
    default:
      return <FaDesktop className="w-3 h-3 text-gray-400" />
  }
}

const createPlatformStats = (stats: any, loading: boolean) => {
  const filterDateRange =
    stats?.filterStart && stats?.filterEnd
      ? `${formatDate(stats.filterStart, "date")} - ${formatDate(stats.filterEnd, "date")}`
      : ""

  return [
    {
      title: "Tổng số lượng máy chủ & Máy chủ mới",
      value: stats?.totalServers ?? 0,
      subValue: stats?.newServersCount ?? 0,
      subValueLabel: "Máy chủ mới:",
      change: filterDateRange,
      changeType: "increase" as const,
      icon: <FaServer className="w-6 h-6 text-gray-400" />,
      loading: loading,
    },
    {
      title: "Top nền tảng (Platform)",
      value: "",
      change: "",
      changeType: "increase" as const,
      listItems: getTop(stats?.platformCounts ?? {}).map(([platform, count]) => ({
        label: platform,
        value: count,
        percentage: Math.round((count / (stats?.totalServers || 1)) * 100),
        icon: mapPlatformIcon(platform),
      })),
      loading: loading,
    },
    {
      title: "Top hệ điều hành (OS)",
      value: "",
      change: "",
      changeType: "increase" as const,
      listItems: getTop(stats?.osCounts ?? {}).map(([os, count]) => ({
        label: os.toLowerCase(),
        value: count,
        percentage: Math.round((count / (stats?.totalServers || 1)) * 100),
        icon: <FaDesktop className="w-3 h-3 text-gray-400" />,
      })),
      loading: loading,
    },
    {
      title: "Top kiến trúc (Arch)",
      value: "",
      change: "",
      changeType: "increase" as const,
      listItems: getTop(stats?.archCounts ?? {}).map(([arch, count]) => ({
        label: arch,
        value: count,
        percentage: Math.round((count / (stats?.totalServers || 1)) * 100),
        icon: <SiArchlinux className="w-3 h-3 text-gray-400" />,
      })),
      loading: loading,
    },
  ]
}

export default function ServerStatistics() {
  const [timeRange, setTimeRange] = useState<TimeRangeTypeUI>("24h")
  const [customStart, setCustomStart] = useState<Date | null>(null)
  const [customEnd, setCustomEnd] = useState<Date | null>(null)

  const effectiveTimeRange = React.useMemo<TimeRangeType>(() => {
    if (timeRange === "custom" && customStart && customEnd) {
      return { start: customStart, end: customEnd }
    }
    return timeRange as TimeRangeType
  }, [timeRange, customStart, customEnd])

  const { stats, loading, error } = useServerStats(effectiveTimeRange)
  const platformStats = useMemo(() => createPlatformStats(stats, loading), [stats, loading])

  const serverCategoryData = useMemo(() => {
    if (loading || !stats || !stats.platformCounts) {
      return []
    }

    const totalPlatforms = Object.values(stats.platformCounts).reduce((sum, count) => sum + (count || 0), 0) as number

    return Object.entries(stats.platformCounts).map(([platform, count]) => {
      const percentage = totalPlatforms > 0 ? Math.round(((count || 0) / totalPlatforms) * 100) : 0
      return {
        name: platform,
        value: count || 0,
        percentage: percentage,
        color: "",
      }
    })
  }, [stats, loading])

  const totalServersForPieChart = useMemo(() => {
    if (loading || !stats || !stats.platformCounts) {
      return "Loading..."
    }
    const total = Object.values(stats.platformCounts).reduce((sum, count) => sum + (count || 0), 0) as number

    if (total >= 1000) {
      return `${(total / 1000).toFixed(2)}K`
    }
    return total.toString()
  }, [stats, loading])

  if (error) return <div className="text-red-500">Error: {error}</div>

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

      <StatsGrid stats={platformStats} />

      <div className="grid grid-cols-8 gap-3">
        <div className="col-span-5">
          <AnalyticsChart stats={stats} loading={loading} />
        </div>
        <div className="col-span-3">
          <ServerPieChart
            title="Classification by platform"
            totalValue={totalServersForPieChart}
            categories={serverCategoryData}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
