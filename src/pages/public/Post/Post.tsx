import { useEffect, useState, useRef, useCallback } from 'react'
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
import { TimeAgo } from '@/components/TimeAgo'

function Post() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostType | null>(null)
  const [isPostLoading, setIsPostLoading] = useState<boolean>(true)
  const [comments, setComments] = useState<CommentType[]>([])
  const [commentsTotal, setCommentsTotal] = useState<number>(0)
  const [isCommentLoading, setIsCommentLoading] = useState<boolean>(false)
  const [isLoadingMoreComments, setIsLoadingMoreComments] =
    useState<boolean>(false)
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true)
  const [commentOffset, setCommentOffset] = useState<number>(0)
  const observerTarget = useRef<HTMLDivElement>(null)

  const COMMENTS_LIMIT = 5

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
      setComments([])
      setCommentOffset(0)
      setHasMoreComments(true)

      try {
        const commentsData = await apiClient.get<
          PaginatedResponse<CommentType>
        >(`/comments/post/${post.id}?offset=0&limit=${COMMENTS_LIMIT}`)
        setComments(commentsData.items)
        setCommentsTotal(commentsData.total)
        setHasMoreComments(commentsData.total > commentsData.items.length)
        setCommentOffset(COMMENTS_LIMIT)
      } catch (err) {
        console.error('Error fetching comments:', err)
      } finally {
        setIsCommentLoading(false)
      }
    }

    fetchComments()
  }, [post?.id])

  const loadMoreComments = useCallback(async () => {
    if (isLoadingMoreComments || !hasMoreComments || !post?.id) return

    setIsLoadingMoreComments(true)
    try {
      const moreComments = await apiClient.get<PaginatedResponse<CommentType>>(
        `/comments/post/${post.id}?offset=${commentOffset}&limit=${COMMENTS_LIMIT}`
      )

      setComments((prev) => [...prev, ...moreComments.items])
      setHasMoreComments(
        comments.length + moreComments.items.length < commentsTotal
      )
      setCommentOffset((prev) => prev + COMMENTS_LIMIT)
    } catch (err) {
      console.error('Error loading more comments:', err)
    } finally {
      setIsLoadingMoreComments(false)
    }
  }, [
    commentOffset,
    comments,
    commentsTotal,
    hasMoreComments,
    isLoadingMoreComments,
    post?.id
  ])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreComments &&
          !isLoadingMoreComments
        ) {
          loadMoreComments()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMoreComments, isLoadingMoreComments, loadMoreComments])

  const handleTagClick = (slug: string) => {
    navigate(`/tag/${slug}`)
  }

  if (isPostLoading) {
    return (
      <div className="flex flex-col gap-8">
        {/* Title skeleton */}
        <Skeleton className="w-3/4 h-12" />

        {/* Author section skeleton */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="w-32 h-6" />
          </div>

          {/* Metadata skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Skeleton className="w-28 h-5" />
            <Skeleton className="w-24 h-5" />
            <Skeleton className="w-20 h-5" />
          </div>

          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="w-20 h-8" />
            <Skeleton className="w-24 h-8" />
            <Skeleton className="w-16 h-8" />
          </div>
        </div>

        <Separator className="my-8" />

        {/* Summary section skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-7 h-7" />
          <Skeleton className="w-24 h-6" />
        </div>
        <Card>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
            </div>
          </CardContent>
        </Card>

        {/* Content skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-5/6 h-4" />
          <Skeleton className="w-full h-4 mt-6" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-4/5 h-4" />
        </div>
      </div>
    )
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
              <Calendar size={16} />
              <TimeAgo dateString={post.created_at} className="text-base" />
            </div>
            <p className="hidden sm:block">•</p>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span className="text-base">
                {post.read_time_minutes} min. read
              </span>
            </div>
            <p className="hidden sm:block">•</p>
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span className="text-base">{post.view_count} views</span>
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
            <>
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="w-1/2 h-20" />
              ))}
            </>
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
            <>
              {comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}

              {isLoadingMoreComments && (
                <div className="flex flex-col gap-4 mt-4">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-20" />
                  ))}
                </div>
              )}

              <div ref={observerTarget} className="h-10" />
            </>
          )}
        </div>
      </div>
    )
  )
}

export default Post
