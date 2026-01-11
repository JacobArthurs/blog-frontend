export interface Comment {
  id: number
  post_id: number
  parent_id?: number
  depth: number
  author_name: string
  author_email: string
  content: string
  like_count: number
  created_at: string
  replies: Comment[]
}

export interface CommentCreate {
  post_id: number
  parent_id?: number
  author_name: string
  author_email: string
  content: string
}
