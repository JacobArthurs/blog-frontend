import type { Post } from './posts'
import type { Tag } from './tags'

export interface SearchResponse {
  posts: Post[]
  tags: Tag[]
}
