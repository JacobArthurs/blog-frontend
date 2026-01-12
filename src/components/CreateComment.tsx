import { RichTextEditor } from '@/components/RichTextEditor'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Spinner } from './ui/spinner'
import { apiClient } from '@/services'
import { CommentCreate } from '@/types'

interface CreateCommentProps {
  postId: number
  parentId?: number
  isReply: boolean
  onCancel?: () => void | Promise<void>
  onSubmit: () => void | Promise<void>
}

export function CreateComment({
  postId,
  parentId,
  isReply,
  onCancel,
  onSubmit
}: CreateCommentProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasContent = () => {
    const textContent = content.replace(/<[^>]*>/g, '').trim()
    return textContent.length > 0
  }

  const handleSubmit = async () => {
    if (!hasContent()) {
      setContent('')
      return
    }

    setIsSubmitting(true)
    try {
      // open modal, get author name, and email
      const createData: CommentCreate = {
        post_id: postId,
        parent_id: parentId,
        content,
        author_name: 'Anonymous',
        author_email: 'a@gmail.com'
      }
      await apiClient.post<Comment>(`/comments`, createData)
      setContent('')
      await onSubmit?.()
    } catch (error) {
      console.error('Failed to submit comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelClick = () => {
    setContent('')
    onCancel?.()
  }

  return (
    <div className="space-y-2">
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder={isReply ? 'Write a reply...' : 'Write a comment...'}
        config={{
          enableImages: false,
          enableLinks: false
        }}
      />
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={handleCancelClick}
        >
          Cancel
        </Button>
        <Button
          className="cursor-pointer"
          onClick={handleSubmit}
          disabled={isSubmitting || !hasContent()}
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
      </div>
    </div>
  )
}
