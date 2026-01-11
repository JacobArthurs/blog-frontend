import { PaginatedResponse } from './pagination'
import type { Post } from './posts'
import type { Tag } from './tags'

export interface SearchResponse {
  posts: PaginatedResponse<Post>
  tags: Tag[]
}
