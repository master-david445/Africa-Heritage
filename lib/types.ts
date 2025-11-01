export interface User {
  id: string
  name: string
  email: string
  bio?: string
  country?: string
  avatar?: string
  joinedDate: Date
  proverbsCount: number
  followersCount: number
  followingCount: number
  points: number
  badges: Badge[]
  isAdmin: boolean
  isVerified: boolean
  isSuspended: boolean
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
}

export interface Proverb {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  proverb: string
  meaning: string
  context?: string
  country: string
  language: string
  categories: string[]
  audioUrl?: string
  timestamp: Date
  likes: string[]
  comments: Comment[]
  bookmarks: string[]
  reactions: Record<string, string[]>
  views: number
  shares: number
  isVerified: boolean
  isFeatured: boolean
}

export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  text: string
  timestamp: Date
  replies: Comment[]
}

export interface Collection {
  id: string
  userId: string
  userName: string
  title: string
  description?: string
  coverImage?: string
  proverbs: string[]
  isPublic: boolean
  isCollaborative: boolean
  contributors: string[]
}
