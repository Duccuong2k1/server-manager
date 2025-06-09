import { Modal } from '@/components/ui/modal'
import { Server } from '@/lib/supabase/types'
import ServerForm from './ServerForm'

interface ServerModalProps {
  isOpen: boolean
  onClose: () => void
  server?: Server
}

export default function ServerModal({ isOpen, onClose, server }: ServerModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-2xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
          {server ? 'Edit Server' : 'Create New Server'}
        </h3>
      </div>

      <ServerForm
        server={server}
        onClose={onClose}
      />
    </Modal>
  )
} 