import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { apiClient } from '@/services/api'
import type {
  Post as PostType,
  Comment as CommentType,
  PaginatedResponse
} from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Calendar,
  Clock,
  Eye,
  Hash,
  MessageCircle,
  MessageCircleX,
  Sparkles
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Comment } from '@/components/Comment'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'

function Post() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostType | null>(null)
  const [isPostLoading, setIsPostLoading] = useState<boolean>(true)
  const [comments, setComments] = useState<CommentType[]>([])
  const [commentsTotal, setCommentsTotal] = useState<number>(0)
  const [isCommentLoading, setIsCommentLoading] = useState<boolean>(false)

  useEffect(() => {
    window.scrollTo(0, 0)

    const fetchPost = async () => {
      if (!slug) return

      setIsPostLoading(true)
      setPost(null)

      try {
        const postData = await apiClient.get<PostType>(`/posts/slug/${slug}`)

        if (!postData) {
          navigate('/404', { replace: true })
          return
        }

        setPost(postData)
      } catch (err) {
        console.error('Error fetching post:', err)
        navigate('/404', { replace: true })
      } finally {
        setIsPostLoading(false)
      }
    }

    fetchPost()
  }, [slug, navigate])

  useEffect(() => {
    const fetchComments = async () => {
      if (!post?.id) return

      setIsCommentLoading(true)

      try {
        const commentsData = await apiClient.get<
          PaginatedResponse<CommentType>
        >(`/comments/post/${post.id}?offset=0&limit=50`)
        setComments(commentsData.items)
        setCommentsTotal(commentsData.total)
      } catch (err) {
        console.error('Error fetching comments:', err)
      } finally {
        setIsCommentLoading(false)
      }
    }

    fetchComments()
  }, [post?.id])

  const handleTagClick = (slug: string) => {
    navigate(`/tag/${slug}`)
  }

  if (isPostLoading) {
    return <Skeleton className="w-full h-8 mt-4 mb-8" />
  }

  return (
    post && (
      <div className="flex flex-col gap-8">
        <h1>{post.title}</h1>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src="https://github.com/jacobarthurs.png"
                alt="Jacob Arthurs"
              />
              <AvatarFallback>JA</AvatarFallback>
            </Avatar>
            <p className="text-xl font-bold">Jacob Arthurs</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <p className="hidden sm:block">•</p>
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{post.read_time_minutes} min. read</span>
            </div>
            <p className="hidden sm:block">•</p>
            <div className="flex items-center gap-2">
              <Eye size={20} />
              <span>{post.view_count} views</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="py-2 px-3 gap-2 text-base cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => handleTagClick(tag.slug)}
              >
                <Hash size={14} />
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex items-center gap-2">
          <Sparkles size={28} />
          <p className="text-lg font-bold">Summary</p>
        </div>
        <Card>
          <CardContent>
            <p>{post.summary}</p>
          </CardContent>
        </Card>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />
        <Separator className="my-8" />
        <div className="flex items-center gap-2">
          <MessageCircle size={28} />
          <p className="text-lg font-bold">{post.comment_count} Comments</p>
        </div>
        <Textarea placeholder="Add a comment..." />
        <div className="flex gap-4 justify-end">
          <Button variant="outline" className="w-fit">
            Cancel
          </Button>
          <Button className="w-fit">Submit</Button>
        </div>
        <div className="flex flex-col gap-4">
          {isCommentLoading ? (
            <Skeleton className="w-full h-20 mt-4 mb-8" />
          ) : post.comment_count === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageCircleX />
                </EmptyMedia>
                <EmptyTitle>No Comments Yet</EmptyTitle>
                <EmptyDescription>
                  No comments have been added to this blog post yet. Be the
                  first to share your thoughts!
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>
    )
  )
}

export default Post
