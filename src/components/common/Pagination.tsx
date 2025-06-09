import Button from '@/components/ui/button/Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i + 1}
          size="sm"
          variant={currentPage === i + 1 ? 'primary' : 'outline'}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  )
} 