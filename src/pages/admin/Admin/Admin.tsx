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
import { Post, Tag, PaginatedResponse } from '@/types'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/services/api'
import { Button } from '@/components/ui/button'

function Admin() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [postOffset, setPostOffset] = useState(0)
  const [postTotal, setPostTotal] = useState(0)
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [tagOffset, setTagOffset] = useState(0)
  const [tagTotal, setTagTotal] = useState(0)

  const POSTS_LIMIT = 10
  const TAGS_LIMIT = 10

  // Page posts via limit and offset
  const handlePostPageChange = async (newOffset: number) => {
    try {
      const data = await apiClient.get<PaginatedResponse<Post>>(
        `/posts/?offset=${newOffset}&limit=${POSTS_LIMIT}`
      )
      setPosts(data.items)
      setPostTotal(data.total)
      setPostOffset(newOffset)
    } catch (err) {
      console.error('Error fetching posts:', err)
    }
  }

  // Page tags via limit and offset
  const handleTagPageChange = async (newOffset: number) => {
    try {
      const data = await apiClient.get<PaginatedResponse<Tag>>(
        `/tags/?offset=${newOffset}&limit=${TAGS_LIMIT}`
      )
      setTags(data.items)
      setTagTotal(data.total)
      setTagOffset(newOffset)
    } catch (err) {
      console.error('Error fetching tags:', err)
    }
  }

  // Fetch initial data on mount
  useEffect(() => {
    const fetchFeaturedPost = async () => {
      try {
        const featuredData = await apiClient.get<Post>('/posts/featured')
        setFeaturedPost(featuredData)
      } catch (err) {
        console.error('Error fetching featured post:', err)
      }
    }

    fetchFeaturedPost()
    handlePostPageChange(0)
    handleTagPageChange(0)
  }, [])

  const postCurrentPage = Math.floor(postOffset / POSTS_LIMIT) + 1
  const postTotalPages = Math.ceil(postTotal / POSTS_LIMIT)
  const tagCurrentPage = Math.floor(tagOffset / TAGS_LIMIT) + 1
  const tagTotalPages = Math.ceil(tagTotal / TAGS_LIMIT)

  const handleTagClick = (id?: number) => {
    navigate(id ? `/admin/tag/${id}` : '/admin/tag')
  }

  const handlePostClick = (id?: number) => {
    navigate(id ? `/admin/post/${id}` : '/admin/post')
  }

  return (
    <div className="flex flex-col gap-8">
      {tags.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Tags</h2>
          <Button
            onClick={() => handleTagClick()}
            className="w-fit cursor-pointer"
          >
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
                  onClick={() => handleTagClick(tag.id)}
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
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    tagCurrentPage > 1 &&
                    handleTagPageChange((tagCurrentPage - 2) * TAGS_LIMIT)
                  }
                  className={
                    tagCurrentPage === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
              {Array.from({ length: tagTotalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() =>
                        handleTagPageChange((page - 1) * TAGS_LIMIT)
                      }
                      isActive={page === tagCurrentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    tagCurrentPage < tagTotalPages &&
                    handleTagPageChange(tagCurrentPage * TAGS_LIMIT)
                  }
                  className={
                    tagCurrentPage === tagTotalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {posts.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Posts</h2>
          <Button
            onClick={() => handlePostClick()}
            className="w-fit cursor-pointer"
          >
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
                  onClick={() => handlePostClick(featuredPost.id)}
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
                  onClick={() => handlePostClick(post.id)}
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
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    postCurrentPage > 1 &&
                    handlePostPageChange((postCurrentPage - 2) * POSTS_LIMIT)
                  }
                  className={
                    postCurrentPage === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
              {Array.from({ length: postTotalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() =>
                        handlePostPageChange((page - 1) * POSTS_LIMIT)
                      }
                      isActive={page === postCurrentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    postCurrentPage < postTotalPages &&
                    handlePostPageChange(postCurrentPage * POSTS_LIMIT)
                  }
                  className={
                    postCurrentPage === postTotalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default Admin
