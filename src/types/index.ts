export interface Lyric {
  id: string
  title: string
  artist: string
  lyrics: string
  backgroundUrl?: string
  gradientType?: string
  createdAt: Date
  userId: string
  creatorName: string
  likes: number
}

export interface User {
  id: string
  name: string
  avatar?: string
}

export type GradientType = 'mesh1' | 'mesh2' | 'mesh3' | 'mesh4'
