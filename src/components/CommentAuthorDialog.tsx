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
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'

const STORAGE_KEY_NAME = 'comment_author_name'
const STORAGE_KEY_EMAIL = 'comment_author_email'

interface CommentAuthorDialogProps {
  open: boolean
  isReply: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (name: string, email: string) => void
  isSubmitting?: boolean
}

export function CommentAuthorDialog({
  open,
  isReply,
  onOpenChange,
  onConfirm,
  isSubmitting = false
}: CommentAuthorDialogProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    if (open) {
      const savedName = localStorage.getItem(STORAGE_KEY_NAME)
      const savedEmail = localStorage.getItem(STORAGE_KEY_EMAIL)

      setName(savedName || '')
      setEmail(savedEmail || '')
      setEmailError('')
      setRememberMe(!!savedName && !!savedEmail)
    }
  }, [open])

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError('Email is required')
      return false
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }

    setEmailError('')
    return true
  }

  const handleConfirm = () => {
    if (!validateEmail(email)) {
      return
    }
    if (!name.trim()) {
      return
    }

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY_NAME, name.trim())
      localStorage.setItem(STORAGE_KEY_EMAIL, email.trim())
    } else {
      localStorage.removeItem(STORAGE_KEY_NAME)
      localStorage.removeItem(STORAGE_KEY_EMAIL)
    }

    onConfirm(name.trim(), email.trim())
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="sr-only">Add comment author</DialogTitle>
          <DialogDescription className="sr-only">
            Add comment author name and email
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-8">
          <h3>Comment Details</h3>
          <div className="flex flex-col gap-2">
            <Label htmlFor="author-name">Name</Label>
            <Input
              id="author-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="author-email">Email</Label>
            <Input
              id="author-email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) {
                  setEmailError('')
                }
              }}
              disabled={isSubmitting}
            />
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me"
              className="cursor-pointer"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              disabled={isSubmitting}
            />
            <Label htmlFor="remember-me">Remember me</Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleConfirm}
            disabled={isSubmitting || !name.trim() || !email.trim()}
          >
            {isSubmitting ? (
              <>
                Submitting...
                <Spinner />
              </>
            ) : isReply ? (
              'Reply'
            ) : (
              'Comment'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
