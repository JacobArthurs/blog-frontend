import { useState, useEffect, useCallback } from 'react'
import { Search, FileText, Tag, FolderX, ArrowDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import { apiClient } from '@/services/api'
import type { SearchResponse } from '@/types/search'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from './ui/empty'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [postsSkip, setPostsSkip] = useState(0)
  const [hasMorePosts, setHasMorePosts] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const navigate = useNavigate()
  const POSTS_LIMIT = 10

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults(null)
        setPostsSkip(0)
        setHasMorePosts(false)
        return
      }

      try {
        const params = new URLSearchParams({
          q: searchQuery,
          skip: '0',
          limit: POSTS_LIMIT.toString()
        })
        const data = await apiClient.get<SearchResponse>(
          `/search/autocomplete?${params}`
        )
        setResults(data)
        setPostsSkip(POSTS_LIMIT)
        setHasMorePosts(data.posts.length === POSTS_LIMIT)
      } catch (error) {
        console.error('Search error:', error)
        setResults(null)
        setPostsSkip(0)
        setHasMorePosts(false)
      }
    },
    [POSTS_LIMIT]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults(null)
      setPostsSkip(0)
      setHasMorePosts(false)
      setIsLoadingMore(false)
    }
  }, [isOpen])

  const handlePostClick = (slug: string) => {
    navigate(`/post/${slug}`)
    onClose()
  }

  const handleTagClick = (slug: string) => {
    navigate(`/tag/${slug}`)
    onClose()
  }

  const loadMorePosts = async () => {
    if (!query.trim() || !results || isLoadingMore) return

    setIsLoadingMore(true)
    try {
      const params = new URLSearchParams({
        q: query,
        skip: postsSkip.toString(),
        limit: POSTS_LIMIT.toString()
      })
      const data = await apiClient.get<SearchResponse>(
        `/search/autocomplete?${params}`
      )

      setResults({
        ...results,
        posts: [...results.posts, ...data.posts]
      })
      setPostsSkip(postsSkip + POSTS_LIMIT)
      setHasMorePosts(data.posts.length === POSTS_LIMIT)
    } catch (error) {
      console.error('Load more posts error:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[80vh] flex flex-col"
      >
        <DialogHeader>
          <DialogTitle className="sr-only">
            Search blog posts and tags
          </DialogTitle>
          <DialogDescription className="sr-only">
            Search through blog posts and tags
          </DialogDescription>
        </DialogHeader>

        <Input
          startIcon={Search}
          placeholder="Search blog posts and tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        {!query && (
          <div className="text-center py-8 text-muted-foreground">
            Start typing to search...
          </div>
        )}

        {query &&
          results &&
          results.posts.length == 0 &&
          results.tags.length == 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderX />
                </EmptyMedia>
                <EmptyTitle>No Results Found</EmptyTitle>
                <EmptyDescription>
                  No blog posts or tags match your search. Try different
                  keywords or check your spelling.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

        {query &&
          results &&
          (results.posts.length > 0 || results.tags.length > 0) && (
            <ScrollArea className="w-full h-[50vh]">
              {results.tags.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <Tag size={28} />
                    <p className="text-lg font-bold">Tags</p>
                  </div>
                  <div className="mt-4">
                    {results.tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagClick(tag.slug)}
                        className="w-full text-left px-3 py-2 hover:bg-accent transition-colors cursor-pointer rounded-md"
                      >
                        <div className="font-medium">{tag.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.posts.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <FileText size={28} />
                    <p className="text-lg font-bold">Blog Posts</p>
                  </div>
                  <div className="mt-4">
                    {results.posts.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => handlePostClick(post.slug)}
                        className="w-full text-left px-3 py-2 hover:bg-accent transition-colors cursor-pointer rounded-md"
                      >
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {post.summary}
                        </div>
                      </button>
                    ))}
                  </div>
                  {hasMorePosts && (
                    <div className="mt-4 flex justify-center">
                      <Button
                        onClick={loadMorePosts}
                        disabled={isLoadingMore}
                        variant="outline"
                      >
                        {isLoadingMore ? 'Loading...' : 'Show more blog posts'}
                        {isLoadingMore ? <Spinner /> : <ArrowDown />}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          )}
      </DialogContent>
    </Dialog>
  )
}

export default SearchModal
