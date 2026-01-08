import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '@/services/api'
import type { Post, Tag } from '@/types'
import { PostCard } from '@/components/PostCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Tag as TagIcon } from 'lucide-react'

function Tag() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [tag, setTag] = useState<Tag | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)
  const observerTarget = useRef<HTMLDivElement>(null)

  const POSTS_PER_PAGE = 4

  useEffect(() => {
    window.scrollTo(0, 0)

    const fetchInitialData = async () => {
      if (!slug) return

      setIsLoading(true)
      setPosts([])
      setPage(0)
      setHasMore(true)
      setTag(null)

      try {
        const [tagData, postsData] = await Promise.all([
          apiClient.get<Tag>(`/tags/slug/${slug}`),
          apiClient.get<Post[]>(
            `/posts/tag/${slug}?skip=0&limit=${POSTS_PER_PAGE}`
          )
        ])

        if (!tagData || postsData.length === 0) {
          navigate('/404', { replace: true })
          return
        }

        setTag(tagData)
        setPosts(postsData)
        setHasMore(postsData.length === POSTS_PER_PAGE)
        setPage(1)
      } catch (err) {
        console.error('Error fetching data:', err)
        navigate('/404', { replace: true })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [slug, navigate])

  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore || !hasMore || !slug) return

    setIsLoadingMore(true)
    try {
      const skip = page * POSTS_PER_PAGE
      const morePosts = await apiClient.get<Post[]>(
        `/posts/tag/${slug}?skip=${skip}&limit=${POSTS_PER_PAGE}`
      )

      setPosts((prev) => [...prev, ...morePosts])
      setHasMore(morePosts.length === POSTS_PER_PAGE)
      setPage((prev) => prev + 1)
    } catch (err) {
      console.error('Error loading more posts:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }, [slug, page, hasMore, isLoadingMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMorePosts()
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
  }, [hasMore, isLoadingMore, loadMorePosts])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <TagIcon size={28} />
            <Skeleton className="h-4 w-40 inline-block" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col gap-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-full my-4" />
                <Skeleton className="h-6 w-full" />
                <div className="flex flex-wrap flex-col sm:flex-row sm:items-center gap-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-32 mt-4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <TagIcon size={28} />
          <p className="text-lg font-bold">{tag?.name}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} isFeatured={false} />
        ))}
      </div>

      {isLoadingMore && (
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col gap-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-full my-4" />
                <Skeleton className="h-6 w-full" />
                <div className="flex flex-wrap flex-col sm:flex-row sm:items-center gap-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-32 mt-4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div ref={observerTarget} className="h-10" />
    </div>
  )
}

export default Tag
