import { Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

function SearchModal({ isOpen, onClose }: SearchModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="sr-only">Search posts</DialogTitle>
          <DialogDescription className="sr-only">
            Search through blog posts and tags
          </DialogDescription>
        </DialogHeader>
        <Input startIcon={Search} placeholder="Search posts..." />
        <div className="mt-4 text-sm text-muted-foreground">
          Search functionality coming soon...
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SearchModal
