import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  FileText,
  Tag as TagIcon,
  FolderX,
  ArrowDown,
  FolderSearch2
} from 'lucide-react'
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { apiClient } from '@/services/api'
import type { SearchResponse } from '@/types/search'
import { Post, Tag } from '@/types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const POSTS_LIMIT = 10

function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [postsOffset, setPostsOffset] = useState(0)
  const [postsTotal, setPostsTotal] = useState<number>(0)
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const navigate = useNavigate()

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setPosts([])
      setPostsTotal(0)
      setPostsOffset(0)
      setTags([])
      return
    }

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        offset: '0',
        limit: POSTS_LIMIT.toString()
      })
      const data = await apiClient.get<SearchResponse>(
        `/search/autocomplete?${params}`
      )
      setPosts(data.posts.items)
      setPostsTotal(data.posts.total)
      setPostsOffset(POSTS_LIMIT)
      setTags(data.tags)
    } catch (error) {
      console.error('Search error:', error)
      setPosts([])
      setPostsTotal(0)
      setPostsOffset(0)
      setTags([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    setIsSearching(true)
    const timer = setTimeout(() => performSearch(query), 300)
    return () => clearTimeout(timer)
  }, [query, performSearch])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setPosts([])
      setPostsTotal(0)
      setPostsOffset(0)
      setTags([])
      setIsLoadingPosts(false)
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
    if (!query.trim() || posts.length >= postsTotal || isLoadingPosts) return

    setIsLoadingPosts(true)
    try {
      const params = new URLSearchParams({
        q: query,
        offset: postsOffset.toString(),
        limit: POSTS_LIMIT.toString()
      })
      const data = await apiClient.get<SearchResponse>(
        `/search/autocomplete?${params}`
      )
      setPosts((prevPosts) => [...prevPosts, ...data.posts.items])
      setPostsTotal(data.posts.total)
      setPostsOffset(postsOffset + POSTS_LIMIT)
    } catch (error) {
      console.error('Load more posts error:', error)
    } finally {
      setIsLoadingPosts(false)
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

        {(!query ||
          (isSearching && posts.length === 0 && tags.length === 0)) && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderSearch2 />
              </EmptyMedia>
              <EmptyTitle>Search Blog Posts and Tags</EmptyTitle>
              <EmptyDescription>
                Start typing to find blog posts and tags that interest you.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {query && !isSearching && posts.length === 0 && tags.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderX />
              </EmptyMedia>
              <EmptyTitle>No Results Found</EmptyTitle>
              <EmptyDescription>
                No blog posts or tags match your search. Try different keywords
                or check your spelling.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {query && (posts.length > 0 || tags.length > 0) && (
          <ScrollArea className="w-full h-[50vh]">
            {tags.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <TagIcon size={28} />
                  <p className="text-lg font-bold">Tags</p>
                </div>
                <div className="mt-4">
                  {tags.map((tag) => (
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

            {posts.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <FileText size={28} />
                  <p className="text-lg font-bold">Blog Posts</p>
                </div>
                <div className="mt-4">
                  {posts.map((post) => (
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
                {posts.length < postsTotal && (
                  <div className="mt-4 mb-2 flex justify-center">
                    <Button
                      onClick={loadMorePosts}
                      disabled={isLoadingPosts}
                      variant="outline"
                    >
                      {isLoadingPosts ? 'Loading...' : 'Show more blog posts'}
                      {isLoadingPosts ? <Spinner /> : <ArrowDown />}
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
