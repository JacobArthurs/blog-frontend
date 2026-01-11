import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { apiClient } from '@/services/api'
import { cn } from '@/lib/utils'
import type { Post, PostCreate, PostUpdate } from '@/types/posts'
import type { Tag } from '@/types/tags'
import type { Comment } from '@/types/comments'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  featured: z.boolean(),
  view_count: z.number().optional(),
  tag_ids: z.array(z.number()).optional(),
  summary: z.string().min(1, 'Summary is required'),
  content: z.string().min(1, 'Content is required')
})

type FormValues = z.infer<typeof formSchema>

function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [tagComboboxOpen, setTagComboboxOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const isEditing = !!id

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      content: '',
      featured: false,
      view_count: 0,
      tag_ids: []
    }
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tagsData, commentsData] = await Promise.all([
          apiClient.get<Tag[]>('/tags/all'),
          id
            ? apiClient.get<Comment[]>(`/comments/post/${id}/all`)
            : Promise.resolve([])
        ])

        setTags(tagsData)
        setComments(commentsData)

        if (id) {
          const postData = await apiClient.get<Post>(`/posts/${id}`)
          form.reset({
            title: postData.title,
            slug: postData.slug,
            summary: postData.summary,
            content: postData.content,
            featured: postData.featured,
            view_count: postData.view_count,
            tag_ids: postData.tags?.map((tag) => tag.id) || []
          })
        }
      } catch (err) {
        console.error('Error loading data', err)
      }
    }

    loadData()
  }, [id, form])

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)
      if (isEditing) {
        const updateData: PostUpdate = {
          title: data.title,
          slug: data.slug || undefined,
          summary: data.summary,
          content: data.content,
          featured: data.featured,
          view_count: data.view_count,
          tag_ids: data.tag_ids
        }
        await apiClient.patch(`/posts/${id}`, updateData)
      } else {
        const createData: PostCreate = {
          title: data.title,
          slug: data.slug || undefined,
          summary: data.summary,
          content: data.content,
          featured: data.featured,
          tag_ids: data.tag_ids
        }
        await apiClient.post('/posts', createData)
      }
      navigate('/admin')
    } catch (error) {
      console.error('Failed to save post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const flattenComments = useCallback(
    (commentList: Comment[]): Array<Comment & { displayDepth: number }> => {
      const result: Array<Comment & { displayDepth: number }> = []

      const traverse = (comments: Comment[], depth: number) => {
        comments.forEach((comment) => {
          result.push({ ...comment, displayDepth: depth })
          if (comment.replies?.length) {
            traverse(comment.replies, depth + 1)
          }
        })
      }

      traverse(commentList, 0)
      return result
    },
    []
  )

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      await apiClient.delete(`/comments/${commentId}`)

      const removeComment = (commentList: Comment[]): Comment[] =>
        commentList
          .filter((c) => c.id !== commentId)
          .map((c) => ({ ...c, replies: removeComment(c.replies) }))

      setComments((prev) => removeComment(prev))
    } catch (error) {
      console.error('Failed to delete comment:', error)
      alert('Failed to delete comment')
    }
  }

  const flatComments = flattenComments(comments)

  return (
    <div className="flex flex-col min-h-[60vh] w-full items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Post' : 'Create New Post'}</CardTitle>
          <CardDescription>
            {isEditing
              ? 'Update the post details below.'
              : 'Enter the details for the new post.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-post" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-post-title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="form-post-title"
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
                    <FieldLabel htmlFor="form-post-slug">
                      Slug (optional)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-post-slug"
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
                name="featured"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="form-post-featured">
                      Featured
                    </FieldLabel>
                    <Checkbox
                      className="w-4!"
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </Field>
                )}
              />
              <Controller
                name="tag_ids"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Tags</FieldLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {field.value?.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId)
                        return tag ? (
                          <div
                            key={tag.id}
                            className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                          >
                            {tag.name}
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(
                                  field.value?.filter((id) => id !== tagId)
                                )
                              }
                              className="hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : null
                      })}
                    </div>
                    <Popover
                      open={tagComboboxOpen}
                      onOpenChange={setTagComboboxOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                          disabled={isLoading}
                        >
                          Add tags...
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search tags..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No tag found.</CommandEmpty>
                            <CommandGroup>
                              {tags.map((tag) => (
                                <CommandItem
                                  key={tag.id}
                                  value={tag.name}
                                  onSelect={() => {
                                    const current = field.value || []
                                    field.onChange(
                                      current.includes(tag.id)
                                        ? current.filter((id) => id !== tag.id)
                                        : [...current, tag.id]
                                    )
                                  }}
                                >
                                  {tag.name}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      field.value?.includes(tag.id)
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </Field>
                )}
              />
              {isEditing && (
                <Controller
                  name="view_count"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-post-view-count">
                        View Count
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-post-view-count"
                        type="number"
                        autoComplete="off"
                        disabled={isLoading}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}
              <Controller
                name="summary"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-post-summary">Summary</FieldLabel>
                    <Textarea
                      {...field}
                      id="form-post-summary"
                      autoComplete="off"
                      rows={6}
                      disabled={isLoading}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-post-content">Content</FieldLabel>
                    <Textarea
                      {...field}
                      id="form-post-content"
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
            <Button type="submit" form="form-post" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </Field>
        </CardFooter>
      </Card>

      {isEditing && (
        <Card className="w-full mt-6">
          <CardHeader>
            <CardTitle>Comments</CardTitle>
            <CardDescription>
              All comments and replies for this post
            </CardDescription>
          </CardHeader>
          <CardContent>
            {comments.length === 0 ? (
              <p className="text-muted-foreground">
                No comments for this post.
              </p>
            ) : (
              <div className="space-y-2">
                {flatComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-2 p-3 text-sm flex justify-between items-start gap-2"
                    style={{ marginLeft: `${comment.displayDepth * 2}rem` }}
                  >
                    <div className="space-y-1 flex-1">
                      <div>
                        <strong>{comment.author_name}</strong> (
                        {comment.author_email})
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {new Date(comment.created_at).toLocaleString()} •{' '}
                        {comment.like_count} likes • ID: {comment.id}
                      </div>
                      <p>{comment.content}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PostPage
