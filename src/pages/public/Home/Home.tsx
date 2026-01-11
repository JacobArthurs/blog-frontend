import { useEffect, useState, useRef, useCallback } from 'react'
import { apiClient } from '@/services/api'
import type { PaginatedResponse, Post } from '@/types'
import { PostCard } from '@/components/PostCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Flame, History } from 'lucide-react'

function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [featuredPost, setFeaturedPost] = useState<Post>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)
  const observerTarget = useRef<HTMLDivElement>(null)

  const POSTS_PER_PAGE = 4

  useEffect(() => {
    window.scrollTo(0, 0)

    const fetchInitialPosts = async () => {
      try {
        const [featuredData, postsData] = await Promise.all([
          apiClient.get<Post>('/posts/featured'),
          apiClient.get<PaginatedResponse<Post>>(
            `/posts/?offset=0&limit=${POSTS_PER_PAGE}`
          )
        ])

        setFeaturedPost(featuredData)
        setPosts(postsData.items)
        setHasMorePosts(postsData.items.length === POSTS_PER_PAGE)
        setPage(1)
      } catch (err) {
        console.error('Error fetching posts:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialPosts()
  }, [])

  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore || !hasMorePosts) return

    setIsLoadingMore(true)
    try {
      const skip = page * POSTS_PER_PAGE
      const morePosts = await apiClient.get<PaginatedResponse<Post>>(
        `/posts/?offset=${skip}&limit=${POSTS_PER_PAGE}`
      )

      setPosts((prev) => [...prev, ...morePosts.items])
      setHasMorePosts(morePosts.items.length === POSTS_PER_PAGE)
      setPage((prev) => prev + 1)
    } catch (err) {
      console.error('Error loading more posts:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }, [page, hasMorePosts, isLoadingMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMorePosts && !isLoadingMore) {
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
  }, [hasMorePosts, isLoadingMore, loadMorePosts])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-8 my-16">
          <div className="flex items-center gap-2">
            <Flame size={28} />
            <p className="text-lg font-bold">Featured Blog Post</p>
          </div>
          <Card>
            <CardContent className="flex flex-col gap-4">
              <Skeleton className="h-10 w-3/4" />
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
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-32 mt-4" />
            </CardFooter>
          </Card>
        </div>
        <div className="flex items-center gap-2">
          <History size={28} />
          <p className="text-lg font-bold">Recent Blog Posts</p>
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
      {featuredPost && (
        <div className="flex flex-col gap-8 my-16">
          <div className="flex items-center gap-2">
            <Flame size={28} />
            <p className="text-lg font-bold">Featured Blog Post</p>
          </div>
          <PostCard post={featuredPost} isFeatured={true} />
        </div>
      )}
      <div className="flex items-center gap-2">
        <History size={28} />
        <p className="text-lg font-bold">Recent Blog Posts</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 auto-rows-fr">
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

export default Home
