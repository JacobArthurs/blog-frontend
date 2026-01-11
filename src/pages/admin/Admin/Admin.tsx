import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/services/api'
import type { Post, Tag, PaginatedResponse } from '@/types'

const POSTS_LIMIT = 10
const TAGS_LIMIT = 10

function Admin() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [postOffset, setPostOffset] = useState(0)
  const [postTotal, setPostTotal] = useState(0)
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [tagOffset, setTagOffset] = useState(0)
  const [tagTotal, setTagTotal] = useState(0)

  const postCurrentPage = Math.floor(postOffset / POSTS_LIMIT) + 1
  const postTotalPages = Math.ceil(postTotal / POSTS_LIMIT)
  const tagCurrentPage = Math.floor(tagOffset / TAGS_LIMIT) + 1
  const tagTotalPages = Math.ceil(tagTotal / TAGS_LIMIT)

  const fetchPosts = async (offset: number) => {
    try {
      const data = await apiClient.get<PaginatedResponse<Post>>(
        `/posts/?offset=${offset}&limit=${POSTS_LIMIT}`
      )
      setPosts(data.items)
      setPostTotal(data.total)
      setPostOffset(offset)
    } catch (err) {
      console.error('Error fetching posts:', err)
    }
  }

  const fetchTags = async (offset: number) => {
    try {
      const data = await apiClient.get<PaginatedResponse<Tag>>(
        `/tags/?offset=${offset}&limit=${TAGS_LIMIT}`
      )
      setTags(data.items)
      setTagTotal(data.total)
      setTagOffset(offset)
    } catch (err) {
      console.error('Error fetching tags:', err)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredData] = await Promise.all([
          apiClient.get<Post>('/posts/featured'),
          fetchPosts(0),
          fetchTags(0)
        ])
        setFeaturedPost(featuredData)
      } catch (err) {
        console.error('Error fetching featured post:', err)
      }
    }

    loadData()
  }, [])

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    limit: number,
    onPageChange: (offset: number) => void
  ) => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              currentPage > 1 && onPageChange((currentPage - 2) * limit)
            }
            className={
              currentPage === 1 ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange((page - 1) * limit)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage * limit)
            }
            className={
              currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )

  return (
    <div className="flex flex-col gap-8">
      {tags.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Tags</h2>
          <Button onClick={() => navigate('/admin/tag')} className="w-fit">
            New Tag
          </Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow
                  key={tag.id}
                  onClick={() => navigate(`/admin/tag/${tag.id}`)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>{tag.id}</TableCell>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{tag.slug}</TableCell>
                  <TableCell>
                    {new Date(tag.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {renderPagination(
            tagCurrentPage,
            tagTotalPages,
            TAGS_LIMIT,
            fetchTags
          )}
        </div>
      )}

      {posts.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Posts</h2>
          <Button onClick={() => navigate('/admin/post')} className="w-fit">
            New Post
          </Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featuredPost && (
                <TableRow
                  key={featuredPost.id}
                  onClick={() => navigate(`/admin/post/${featuredPost.id}`)}
                  className="bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90"
                >
                  <TableCell>{featuredPost.id}</TableCell>
                  <TableCell>{featuredPost.title}</TableCell>
                  <TableCell>{featuredPost.slug}</TableCell>
                  <TableCell>{featuredPost.view_count}</TableCell>
                  <TableCell>{featuredPost.comment_count}</TableCell>
                  <TableCell>
                    {new Date(featuredPost.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              )}
              {posts.map((post) => (
                <TableRow
                  key={post.id}
                  onClick={() => navigate(`/admin/post/${post.id}`)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>{post.id}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.slug}</TableCell>
                  <TableCell>{post.view_count}</TableCell>
                  <TableCell>{post.comment_count}</TableCell>
                  <TableCell>
                    {new Date(post.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {renderPagination(
            postCurrentPage,
            postTotalPages,
            POSTS_LIMIT,
            fetchPosts
          )}
        </div>
      )}
    </div>
  )
}

export default Admin
