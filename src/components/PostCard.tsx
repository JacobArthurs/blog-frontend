import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Post } from '@/types'
import { Calendar, Clock, Eye, MoveRight, TagIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface PostCardProps {
  post: Post
  isFeatured?: boolean
}

export function PostCard({ post, isFeatured = false }: PostCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setMousePosition({ x, y })
  }

  const handleTagClick = (slug: string) => {
    navigate(`/tag/${slug}`)
  }

  const handlePostClick = (slug: string) => {
    navigate(`/post/${slug}`)
  }

  return (
    <Card
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-100 overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl post-card"
      style={
        {
          '--mouse-x': `${mousePosition.x}%`,
          '--mouse-y': `${mousePosition.y}%`
        } as React.CSSProperties
      }
    >
      <CardContent className="flex flex-col justify-between h-full">
        <div>
          {isFeatured ? <h1>{post.title}</h1> : <h3>{post.title}</h3>}
          <p className="my-8 text-muted-foreground">{post.summary}</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
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
                className="py-1 px-3 gap-2 text-base cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => handleTagClick(tag.slug)}
              >
                <TagIcon />
                {tag.name}
              </Badge>
            ))}
          </div>
          <Button
            className="cursor-pointer mt-8 w-fit"
            onClick={() => handlePostClick(post.slug)}
          >
            Read Post
            <MoveRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
