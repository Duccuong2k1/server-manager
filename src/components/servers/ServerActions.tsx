import { useState } from 'react'
import { Dropdown } from '@/components/ui/dropdown/Dropdown'
import { Server, ServerStatus } from '@/lib/supabase/types'
import { MoreDotIcon } from '@/icons'
import Button from '@/components/ui/button/Button'

interface ServerActionsProps {
  server: Server
  onEdit: (server: Server) => void
  onDelete: (server: Server) => void
  onChangeStatus: (server: Server, status: ServerStatus) => void
}

export default function ServerActions({ server, onEdit, onDelete, onChangeStatus }: ServerActionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => setIsOpen(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-toggle p-1"
      >
      <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
      </Button>

      <Dropdown isOpen={isOpen} onClose={handleClose} className="w-56">
        <div className="py-1">
          <button
            onClick={() => {
              onEdit(server)
              handleClose()
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Edit Server
          </button>
        </div>

        <div className="py-1">
          <button
            onClick={() => {
              onChangeStatus(server, 'active')
              handleClose()
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Set Active
          </button>
          <button
            onClick={() => {
              onChangeStatus(server, 'inactive')
              handleClose()
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Set Inactive
          </button>
          <button
            onClick={() => {
              onChangeStatus(server, 'maintenance')
              handleClose()
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Set Maintenance
          </button>
        </div>

        <div className="py-1">
          <button
            onClick={() => {
              onDelete(server)
              handleClose()
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Delete Server
          </button>
        </div>
      </Dropdown>
    </div>
  )
} 