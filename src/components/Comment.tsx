import { Comment as CommentType } from '@/types/comments'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { TimeAgo } from '@/components/TimeAgo'
import CryptoJS from 'crypto-js'
import { ChevronDown, ThumbsDown, ThumbsUp } from 'lucide-react'
import { apiClient } from '@/services/api'
import { useState } from 'react'

interface CommentProps {
  comment: CommentType
}

export function Comment({ comment }: CommentProps) {
  const [likeCount, setLikeCount] = useState(comment.like_count)

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ')

    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }

    return name.slice(0, 2).toUpperCase()
  }

  const handleLike = async () => {
    try {
      const updatedComment = await apiClient.post<CommentType>(
        `/comments/${comment.id}/like`,
        {}
      )
      setLikeCount(updatedComment.like_count)
    } catch (error) {
      console.error('Failed to like comment:', error)
    }
  }

  const handleDislike = async () => {
    try {
      const updatedComment = await apiClient.post<CommentType>(
        `/comments/${comment.id}/dislike`,
        {}
      )
      setLikeCount(updatedComment.like_count)
    } catch (error) {
      console.error('Failed to dislike comment:', error)
    }
  }

  const handleReply = () => {
    // Implement reply functionality here
  }

  return (
    <div className="relative">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={`https://www.gravatar.com/avatar/${CryptoJS.MD5(
              comment.author_email.trim().toLowerCase()
            )}?s=200&d=retro&r=g`}
            alt={comment.author_name}
          />
          <AvatarFallback>{getInitials(comment.author_name)}</AvatarFallback>
        </Avatar>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              {comment.author_name}
            </span>
            <TimeAgo
              dateString={comment.created_at}
              className="text-xs text-muted-foreground"
            />
          </div>

          <p className="text-sm mb-2">{comment.content}</p>

          <div className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer"
                  onClick={handleLike}
                >
                  <ThumbsUp size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Like</TooltipContent>
            </Tooltip>
            {likeCount !== 0 && (
              <span className="inline-block w-8 text-center text-sm text-muted-foreground">
                {likeCount > 0 ? `+${likeCount}` : likeCount}
              </span>
            )}
            {likeCount === 0 && <div className="mx-1"></div>}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer"
                  onClick={handleDislike}
                >
                  <ThumbsDown size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Dislike</TooltipContent>
            </Tooltip>
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer ml-2"
              onClick={handleReply}
            >
              Reply
            </Button>
          </div>
        </div>
      </div>

      {comment.replies.length > 0 && (
        <Accordion
          type="multiple"
          defaultValue={['replies']}
          className="ml-4 sm:ml-8 md:ml-14"
        >
          <AccordionItem value="replies" className="border-none group">
            <AccordionTrigger className="hover:no-underline [&>svg]:hidden [&[data-state=open]_svg]:rotate-180 p-0 mt-2 mb-3">
              <Button className="w-fit cursor-pointer" variant="ghost" asChild>
                <span>
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-200"
                  />
                  {comment.replies.length}
                  &nbsp;
                  {comment.replies.length === 1 ? 'reply' : 'replies'}
                </span>
              </Button>
            </AccordionTrigger>
            <AccordionContent>
              {comment.replies.map((reply) => (
                <Comment key={reply.id} comment={reply} />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )
}
