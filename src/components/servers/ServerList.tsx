'use client'

import { useState } from 'react'
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
import ServerModal from './ServerModal'
import ServerActions from './ServerActions'
import { Server } from '@/lib/supabase/types'
import { formatDate } from '@/lib/helpers/parser'
import Pagination from '../common/Pagination'
import { Modal } from '@/components/ui/modal'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const statusColors = {
  active: 'success',
  inactive: 'info',
  maintenance: 'warning',
} as const

export default function ServerList() {
  const pageSize = 10
  const {
    servers,
    loading,
    error,
    total,
    currentPage,
    setCurrentPage,
    addServer,
    updateServer,
    deleteServer,
    refreshServers
  } = useServers(1, pageSize)
  const [selectedServer, setSelectedServer] = useState<Server | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const totalPages = Math.ceil(total / pageSize)
  const [deleteTarget, setDeleteTarget] = useState<Server | undefined>()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [actionOpenId, setActionOpenId] = useState<string | undefined>()

  const handleCreateServer = () => {
    setSelectedServer(undefined)
    setIsModalOpen(true)
  }

  const handleEditServer = (server: Server) => {
    setSelectedServer(server)
    setIsModalOpen(true)
  }

  const handleDeleteServer = async (server: Server) => {
    setDeleteTarget(server)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (deleteTarget) {
      await deleteServer(deleteTarget.id)
      refreshServers()
      setShowDeleteModal(false)
      setDeleteTarget(undefined)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setDeleteTarget(undefined)
  }

  const handleChangeStatus = async (server: Server, status: Server['status']) => {
    await updateServer(server.id, { ...server, status })
    refreshServers()
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Server List</h3>
        <Button
          onClick={handleCreateServer}
          startIcon={
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        >
          Add Server
        </Button>
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
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Created At</TableCell>
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
            ) : servers.length > 0 ? servers.map((server, index) => (
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
                <TableCell className="py-3 text-gray-900 dark:text-white text-theme-sm">{formatDate(server.created_at, "datetime")}</TableCell>
                <TableCell className="py-3">
                  <Badge size="sm" color={statusColors[server.status]}>
                    {server.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-end">
                  <ServerActions
                    server={server}
                    onEdit={handleEditServer}
                    onDelete={handleDeleteServer}
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
                <TableCell colSpan={7} className="text-center">No servers found</TableCell>
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
        onSave={async (data) => {
          if (selectedServer) {
            await updateServer(selectedServer.id, data)
          } else {
            await addServer(data)
          }
          setIsModalOpen(false)
          refreshServers()
        }}
      />
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        serverName={deleteTarget?.name}
      />
    </div>
  )
} 