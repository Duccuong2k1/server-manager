"use client"
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useServerActivities } from '@/hooks/useServerActivities'
import { useServers } from '@/hooks/useServers'
import { formatDate } from '@/lib/helpers/parser'
import { Server } from '@/lib/supabase/types'
import { useState } from 'react'
import Pagination from '../common/Pagination'
import SkeletonTable from '../common/SkeletonTable'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import ServerActions from './ServerActions'
import ServerModal from './ServerModal'

const statusColors = {
  active: 'success',
  inactive: 'info',
  maintenance: 'warning',
} as const

export default function ServerList() {
  const pageSize = 10
  const {
    servers, loading, error, total,
    currentPage, setCurrentPage,
    addServer, updateServer, deleteServer, refreshServers
  } = useServers(1, pageSize)
  const [selectedServer, setSelectedServer] = useState<Server | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Server | undefined>()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [actionOpenId, setActionOpenId] = useState<string | undefined>()
  const { addActivity } = useServerActivities()
  const totalPages = Math.ceil(total / pageSize)


  const handleSaveServer = async (data: any) => {
    try {
      if (selectedServer) {
        await updateServer(selectedServer.id, data)
        await addActivity({
          server_id: selectedServer.id,
          type: 'update',
          status: 'success',
          message: `Updated server ${selectedServer.name}`,
        })
      } else {
        const newServer = await addServer(data)
        await addActivity({
          server_id: newServer.id,
          type: 'created',
          status: 'success',
          message: `Created server ${newServer.name}`,
        })
      }
      setIsModalOpen(false)
      refreshServers()
    } catch (err) {
      await addActivity({
        server_id: selectedServer?.id ?? '',
        type: selectedServer ? 'update' : 'created',
        status: 'failed',
        message: `Failed to ${selectedServer ? 'update' : 'created'} server`,
      })
    }
  }


  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const serverToDelete = { ...deleteTarget }; // Lưu thông tin server trước khi xóa
    
    try {
  
      await addActivity({
        server_id: deleteTarget.id,
        type: 'delete',
        status: 'success',
        message: `Successfully deleted server ${serverToDelete.name}`,
      });

  
      await deleteServer(deleteTarget.id);
      refreshServers();
    } catch (err) {
      await addActivity({
        server_id: deleteTarget.id,
        type: 'delete',
        status: 'failed',
        message: `Failed to delete server ${serverToDelete.name}`,
      });
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(undefined);
    }
  }


const handleChangeStatus = async (server: Server, status: Server['status']) => {
  try {
    await updateServer(server.id, { ...server, status })
    await addActivity({
      server_id: server.id,
      type: status === 'maintenance' ? 'maintenance' : 'update',
      status: status === 'maintenance' ? 'offline' : 'success',
      message: status === 'maintenance'
        ? `Changed status to maintenance (offline)`
        : `Changed status to ${status}`,
    })
    refreshServers()
  } catch (err) {
    await addActivity({
      server_id: server.id,
      type: 'update',
      status: 'failed',
      message: `Failed to change status to ${status}`,
    })
  }
}

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Server List</h3>
        <Button onClick={() => { setSelectedServer(undefined); setIsModalOpen(true) }}>
          Add Server
        </Button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">NAME (IP ADDRESS)</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">COUNTRY</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">OS</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">PLATFORM</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">ARCHITECTURE</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">CREATED AT</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">STATUS</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">ACTIONS</TableCell>
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
            ) : servers.length > 0 ? servers.map((server, index) => (
              <TableRow key={server.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-900 dark:text-white text-theme-sm">{server.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-theme-xs">{server.ip_address}</p>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">{server.country}</TableCell>
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">{server.os}</TableCell>
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">{server.platform}</TableCell>
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">{server.architecture}</TableCell>
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">{formatDate(server.created_at, "datetime")}</TableCell>
                <TableCell className="py-3">
                  <Badge size="sm" color={statusColors[server.status]}>
                    {server.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-end">
                  <ServerActions
                    server={server}
                    onEdit={(srv) => { setSelectedServer(srv); setIsModalOpen(true) }}
                    onDelete={(srv) => { setDeleteTarget(srv); setShowDeleteModal(true) }}
                    onChangeStatus={handleChangeStatus}
                    direction={index >= servers.length - 3 ? 'up' : 'down'}
                    isOpen={actionOpenId === server.id}
                    onOpen={() => setActionOpenId(server.id)}
                    onClose={() => setActionOpenId(undefined)}
                  />
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">No servers found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-500 ml-4">Total: {total} servers</span>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <ServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        server={selectedServer}
        onSave={handleSaveServer}
      />
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteTarget(undefined) }}
        onConfirm={confirmDelete}
        serverName={deleteTarget?.name}
      />
    </div>
  )
}