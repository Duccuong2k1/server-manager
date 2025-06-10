"use client"
import React, { useEffect } from 'react';
import { useServerActivities } from '@/hooks/useServerActivities';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';
import SkeletonTable from '../common/SkeletonTable';
import { formatDate } from '@/lib/helpers/parser';



const statusColors = {
  success: 'success',
  Rebooting: 'info',
  Warning: 'warning',
  Removed: 'error',
  offline:"error",
  created: 'success',
  network: 'info',
  update: 'info',
  reboot: 'warning',
  alert: 'error',
  migrate: 'info',
  system:"info",
  delete:"error",
  maintenance:"warning"
} as const


export default function ServerRecentActivities() {

  const { activities, loading, error, refreshActivities } = useServerActivities();

  useEffect(() => {
    refreshActivities();
  }, []);



  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Hoạt động gần đây trên các máy chủ</h3>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Server ID</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Thời gian</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Loại hoạt động</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Trạng thái</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nội dung</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (  <>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index} className="animate-pulse">
                   <SkeletonTable />
                  </TableRow>
                ))}
              </>
            ) : 
            activities.slice(0, 10).map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="py-3  text-gray-900 dark:text-white text-theme-sm">{activity.server_id}</TableCell>
                <TableCell className="py-3  text-gray-900 dark:text-white text-theme-sm">{formatDate(activity.created_at, "date_hour_second")}</TableCell>
                <TableCell className="py-3  text-gray-900 dark:text-whitetext-theme-sm">
                  <Badge size="sm" color={statusColors[activity.type as keyof typeof statusColors]}>{activity.type}</Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">
                  <Badge size="sm" color={statusColors[activity.status as keyof typeof statusColors]}>{activity.status}</Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">{activity.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 