import { Modal } from '@/components/ui/modal'
import Button from '@/components/ui/button/Button'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  serverName?: string
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, serverName }: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
        <p className="mb-4">Are you sure you want to delete server <b>{serverName}</b>?</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </Modal>
  )
} 