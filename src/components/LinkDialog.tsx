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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'

const urlValidation = z
  .string()
  .min(1, 'URL is required')
  .trim()
  .refine(
    (url) => {
      let urlToValidate = url

      if (!urlToValidate.match(/^[a-zA-Z][a-zA-Z\d+\-.]*:/)) {
        urlToValidate = 'http://' + urlToValidate
      }

      try {
        const urlObj = new URL(urlToValidate)

        if (!urlObj.hostname || !urlObj.hostname.includes('.')) {
          return false
        }

        if (urlObj.hostname.endsWith('.')) {
          return false
        }

        const domainPattern =
          /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        return domainPattern.test(urlObj.hostname)
      } catch {
        return false
      }
    },
    { message: 'Please enter a valid URL' }
  )

const formSchema = z.object({
  url: urlValidation,
  text: z.string().trim()
})

type FormValues = z.infer<typeof formSchema>

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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      text: ''
    }
  })

  useEffect(() => {
    if (open) {
      form.reset({
        url: initialUrl,
        text: initialText
      })
    }
  }, [open, initialUrl, initialText, form])

  const onSubmit = (data: FormValues) => {
    onConfirm(data.url, data.text)
    onOpenChange(false)
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

        <form
          id="form-link"
          onSubmit={(e) => {
            e.stopPropagation()
            form.handleSubmit(onSubmit)(e)
          }}
        >
          <div className="flex flex-col gap-8">
            <h3>Add Link</h3>
            <FieldGroup>
              <Controller
                name="text"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="link-text">Text</FieldLabel>
                    <Input
                      {...field}
                      id="link-text"
                      type="text"
                      placeholder="Text to display"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="url"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="link-url">Link</FieldLabel>
                    <Input
                      {...field}
                      id="link-url"
                      type="text"
                      placeholder="https://example.com"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
          >
            Cancel
          </Button>
          <Button type="submit" form="form-link" className="cursor-pointer">
            Add Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
