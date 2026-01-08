import type { PostSearchResult } from './posts'
import type { TagSearchResult } from './tags'

export interface SearchResponse {
  posts: PostSearchResult[]
  tags: TagSearchResult[]
}
