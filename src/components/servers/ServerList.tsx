'use client'

import { useServers } from '@/hooks/useServers'
import { MoreDotIcon } from '@/icons'
import Button from '@/components/ui/button/Button'
import Badge from '@/components/ui/badge/Badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import SkeletonTable from '../common/SkeletonTable'

const statusColors = {
  active: 'success',
  inactive: 'info',
  maintenance: 'warning',
} as const

export default function ServerList() {
  const { servers, loading, error } = useServers()


  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Server List</h3>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Name (IP Address)</TableCell>
             
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Region</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">OS</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Platform</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Architecture</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index} className="animate-pulse">
                   <SkeletonTable />
                  </TableRow>
                ))}
              </>
            ) : servers.length > 0 ? servers.map((server) => (
              <TableRow key={server.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-900 dark:text-white text-theme-sm">{server.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-theme-xs">{server.ip_address}</p>
                  </div>
                  </TableCell>

            
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">{server.region}</TableCell>
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">{server.os}</TableCell>
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">{server.platform}</TableCell>
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">{server.architecture}</TableCell>
                <TableCell className="py-3">
                  <Badge size="sm" color={statusColors[server.status]}>
                    {server.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-end">
                  <Button variant="outline" size="sm">
                    <MoreDotIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No servers found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 