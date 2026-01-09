import type { Tag } from './tags'

export interface Post {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  view_count: number
  read_time_minutes: number
  featured: boolean
  created_at: string
  updated_at: string
  tags: Tag[]
}

export interface PostCreate {
  title: string
  summary: string
  content: string
  slug?: string
  tag_ids?: number[]
  featured?: boolean
}

export interface PostUpdate {
  title?: string
  summary?: string
  content?: string
  view_count?: number
  slug?: string
  tag_ids?: number[]
  featured?: boolean
}
