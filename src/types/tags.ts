export interface Tag {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface TagCreate {
  name: string
  slug?: string
}

export interface TagUpdate {
  name?: string
  slug?: string
}
