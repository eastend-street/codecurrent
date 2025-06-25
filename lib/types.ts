export interface Article {
  id: string
  title: string
  url: string
  score: number
  author: string
  timestamp: number
  description?: string
  source: 'hackernews' | 'reddit'
  thumbnail?: string
  thumbnailAlt?: string
}

export interface HackerNewsItem {
  id: number
  title: string
  url?: string
  score: number
  by: string
  time: number
  text?: string
}

export interface RedditPost {
  id: string
  title: string
  url: string
  score: number
  author: string
  created_utc: number
  selftext?: string
  subreddit: string
  thumbnail?: string
}

export type TabType = 'hackernews' | 'reddit'