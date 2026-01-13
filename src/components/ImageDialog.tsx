import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ImageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (urlOrFile: string | File) => void
  isUploading?: boolean
}

export function ImageDialog({
  open,
  onOpenChange,
  onConfirm,
  isUploading = false
}: ImageDialogProps) {
  const [imageUrl, setImageUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (open) {
      setImageUrl('')
      setSelectedFile(null)
    }
  }, [open])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImageUrl('')
    }
  }

  const handleConfirm = () => {
    if (selectedFile) {
      onConfirm(selectedFile)
    } else if (imageUrl) {
      onConfirm(imageUrl)
    }
  }

  const handleClose = () => {
    setImageUrl('')
    setSelectedFile(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="file">Select Image</Label>
              <Input
                id="file"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="url" className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="url">Image URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value)
                  setSelectedFile(null)
                }}
                disabled={isUploading}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleConfirm}
            disabled={isUploading || (!selectedFile && !imageUrl)}
          >
            {isUploading ? 'Adding...' : 'Add Image'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
