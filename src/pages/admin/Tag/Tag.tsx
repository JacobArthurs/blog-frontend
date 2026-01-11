import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'
import { apiClient } from '@/services/api'
import type { Tag, TagCreate, TagUpdate } from '@/types/tags'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>

function TagPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!id

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: ''
    }
  })

  useEffect(() => {
    if (!id) return

    const loadTag = async () => {
      try {
        setIsLoading(true)
        const tagData = await apiClient.get<Tag>(`/tags/${id}`)
        form.reset({
          name: tagData.name,
          slug: tagData.slug
        })
      } catch (err) {
        console.error('Error fetching tag', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadTag()
  }, [id, form])

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)
      if (isEditing) {
        const updateData: TagUpdate = {
          name: data.name,
          slug: data.slug || undefined
        }
        await apiClient.patch(`/tags/${id}`, updateData)
      } else {
        const createData: TagCreate = {
          name: data.name,
          slug: data.slug || undefined
        }
        await apiClient.post('/tags', createData)
      }
      navigate('/admin')
    } catch (error) {
      console.error('Failed to save tag:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Tag' : 'Create New Tag'}</CardTitle>
          <CardDescription>
            {isEditing
              ? 'Update the tag details below.'
              : 'Enter the details for the new tag.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-tag" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-tag-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="form-tag-name"
                      autoComplete="off"
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-tag-slug">
                      Slug (optional)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-tag-slug"
                      autoComplete="off"
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" form="form-tag" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}

export default TagPage
