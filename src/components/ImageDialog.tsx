import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'

const formSchema = z.object({
  imageUrl: z.string().trim().optional()
})

type FormValues = z.infer<typeof formSchema>

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: ''
    }
  })

  useEffect(() => {
    if (open) {
      form.reset({ imageUrl: '' })
      setSelectedFile(null)
    }
  }, [open, form])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      form.setValue('imageUrl', '')
    }
  }

  const onSubmit = (data: FormValues) => {
    if (selectedFile) {
      onConfirm(selectedFile)
    } else if (data.imageUrl) {
      onConfirm(data.imageUrl)
    }
  }

  const handleClose = () => {
    form.reset()
    setSelectedFile(null)
    onOpenChange(false)
  }

  const hasContent = selectedFile || form.watch('imageUrl')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
        </DialogHeader>

        <form
          id="form-image"
          onSubmit={(e) => {
            e.stopPropagation()
            form.handleSubmit(onSubmit)(e)
          }}
        >
          <Tabs defaultValue="upload" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="cursor-pointer">
                Upload
              </TabsTrigger>
              <TabsTrigger value="url" className="cursor-pointer">
                URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="flex flex-col gap-4 mt-8">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="file">Select Image</FieldLabel>
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
                </Field>
              </FieldGroup>
            </TabsContent>

            <TabsContent value="url" className="flex flex-col gap-4 mt-8">
              <FieldGroup>
                <Controller
                  name="imageUrl"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="url">Image URL</FieldLabel>
                      <Input
                        {...field}
                        id="url"
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        autoComplete="off"
                        disabled={isUploading}
                        onChange={(e) => {
                          field.onChange(e)
                          setSelectedFile(null)
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </TabsContent>
          </Tabs>
        </form>

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
            type="submit"
            form="form-image"
            className="cursor-pointer"
            disabled={isUploading || !hasContent}
          >
            {isUploading ? 'Adding...' : 'Add Image'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
