export interface Tag {
  id: number
  name: string
  slug: string
}

export interface TagCreate {
  name: string
  slug?: string
}

export interface TagUpdate {
  name?: string
  slug?: string
}

export interface TagSearchResult {
  id: number
  name: string
  slug: string
}
