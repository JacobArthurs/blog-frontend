import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'

const STORAGE_KEY_NAME = 'comment_author_name'

const formSchema = z.object({
  name: z.string().min(2, 'Name is required').trim(),
  rememberMe: z.boolean()
})

type FormValues = z.infer<typeof formSchema>

interface CommentAuthorDialogProps {
  open: boolean
  isReply: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (name: string) => void
  isSubmitting?: boolean
}

export function CommentAuthorDialog({
  open,
  isReply,
  onOpenChange,
  onConfirm,
  isSubmitting = false
}: CommentAuthorDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      rememberMe: false
    }
  })

  useEffect(() => {
    if (open) {
      const savedName = localStorage.getItem(STORAGE_KEY_NAME)

      form.reset({
        name: savedName || '',
        rememberMe: !!savedName
      })
    }
  }, [open, form])

  const onSubmit = (data: FormValues) => {
    if (data.rememberMe) {
      localStorage.setItem(STORAGE_KEY_NAME, data.name)
    } else {
      localStorage.removeItem(STORAGE_KEY_NAME)
    }

    onConfirm(data.name)
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
            Add comment author name
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-comment-author"
          onSubmit={(e) => {
            e.stopPropagation()
            form.handleSubmit(onSubmit)(e)
          }}
        >
          <div className="flex flex-col gap-8">
            <h3>Comment Details</h3>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="author-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="author-name"
                      type="text"
                      placeholder="Your display name"
                      autoComplete="name"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="rememberMe"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember-me"
                        className="cursor-pointer"
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        disabled={isSubmitting}
                      />
                      <FieldLabel htmlFor="remember-me">Remember me</FieldLabel>
                    </div>
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </form>

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
            type="submit"
            form="form-comment-author"
            className="cursor-pointer"
            disabled={isSubmitting}
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
