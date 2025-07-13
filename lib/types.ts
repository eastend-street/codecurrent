export interface Article {
  id: string
  title: string
  url: string
  score: number
  author: string
  timestamp: number
  description?: string
  source: 'hackernews' | 'reddit' | 'blog'
  blogName?: string
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

export interface BlogConfig {
  name: string
  url: string
  feedUrl: string
  description: string
  category: string
}

export interface BlogPost {
  title: string
  link: string
  description?: string
  author?: string
  pubDate?: string
  content?: string
}

