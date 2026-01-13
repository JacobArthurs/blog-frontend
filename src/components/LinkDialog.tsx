import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface LinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialUrl?: string
  initialText?: string
  onConfirm: (url: string, text: string) => void
}

export function LinkDialog({
  open,
  onOpenChange,
  initialUrl = '',
  initialText = '',
  onConfirm
}: LinkDialogProps) {
  const [linkUrl, setLinkUrl] = useState(initialUrl)
  const [linkText, setLinkText] = useState(initialText)
  const [linkUrlError, setLinkUrlError] = useState('')

  useEffect(() => {
    if (open) {
      setLinkUrl(initialUrl)
      setLinkText(initialText)
      setLinkUrlError('')
    }
  }, [open, initialUrl, initialText])

  const validateUrl = (url: string): boolean => {
    if (!url) {
      setLinkUrlError('URL is required')
      return false
    }

    let urlToValidate = url.trim()

    if (!urlToValidate.match(/^[a-zA-Z][a-zA-Z\d+\-.]*:/)) {
      urlToValidate = 'http://' + urlToValidate
    }

    try {
      const urlObj = new URL(urlToValidate)

      if (!urlObj.hostname || !urlObj.hostname.includes('.')) {
        setLinkUrlError('Please enter a valid URL')
        return false
      }

      if (urlObj.hostname.endsWith('.')) {
        setLinkUrlError('Please enter a valid URL')
        return false
      }

      const domainPattern =
        /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      if (!domainPattern.test(urlObj.hostname)) {
        setLinkUrlError('Please enter a valid URL')
        return false
      }

      setLinkUrlError('')
      return true
    } catch {
      setLinkUrlError('Please enter a valid URL')
      return false
    }
  }

  const handleConfirm = () => {
    if (!validateUrl(linkUrl)) {
      return
    }
    onConfirm(linkUrl, linkText)
    handleClose()
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">Add Link to Content</DialogTitle>
          <DialogDescription className="sr-only">
            Provide the URL and optional text for the link.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-8">
          <h3>Add Link</h3>
          <div className="flex flex-col gap-2">
            <Label htmlFor="link-text">Text</Label>
            <Input
              id="link-text"
              type="text"
              placeholder="Text to display"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="link-url">Link</Label>
            <Input
              id="link-url"
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => {
                setLinkUrl(e.target.value)
                if (linkUrlError) {
                  setLinkUrlError('')
                }
              }}
            />
            {linkUrlError && (
              <p className="text-sm text-destructive">{linkUrlError}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleConfirm}
            disabled={!linkUrl}
          >
            Add Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
