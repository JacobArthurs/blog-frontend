export interface Comment {
  id: number
  post_id: number
  parent_id: number | null
  author_name: string
  author_email: string
  content: string
  created_at: string
  replies: Comment[]
}

export interface CommentCreate {
  post_id: number
  parent_id?: number | null
  author_name: string
  author_email: string
  content: string
}
