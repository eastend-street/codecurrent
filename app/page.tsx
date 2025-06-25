import { Suspense } from 'react'
import { Article, HackerNewsItem, RedditPost } from '@/lib/types'
import ArticleList from './components/ArticleList'

async function fetchHackerNewsTop(): Promise<Article[]> {
  try {
    const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    const topStoryIds = await topStoriesRes.json()
    
    const stories = await Promise.all(
      topStoryIds.slice(0, 10).map(async (id: number) => {
        const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        return storyRes.json()
      })
    )

    return stories
      .filter((story: HackerNewsItem) => story && story.url)
      .map((story: HackerNewsItem) => ({
        id: story.id.toString(),
        title: story.title,
        url: story.url!,
        score: story.score,
        author: story.by,
        timestamp: story.time,
        source: 'hackernews' as const
      }))
  } catch (error) {
    console.error('Failed to fetch Hacker News:', error)
    return []
  }
}

async function fetchRedditTop(): Promise<Article[]> {
  try {
    const subreddits = ['programming', 'technology', 'webdev', 'MachineLearning', 'startups', 'ClaudeAI', 'ycombinator', 'cursor']
    
    const allPosts = await Promise.all(
      subreddits.map(async (subreddit) => {
        try {
          const res = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=5&t=day`, {
            headers: {
              'User-Agent': 'CodeCurrent/1.0'
            }
          })
          const data = await res.json()
          return data.data.children.map((child: { data: RedditPost }) => child.data)
        } catch (error) {
          console.error(`Failed to fetch r/${subreddit}:`, error)
          return []
        }
      })
    )

    const posts = allPosts.flat()
      .filter((post: RedditPost) => post && !post.url.includes('reddit.com/r/'))
      .sort((a: RedditPost, b: RedditPost) => b.score - a.score)
      .slice(0, 10)

    return posts.map((post: RedditPost) => ({
      id: post.id,
      title: post.title,
      url: post.url,
      score: post.score,
      author: post.author,
      timestamp: post.created_utc,
      description: post.selftext ? post.selftext.slice(0, 200) + '...' : undefined,
      source: 'reddit' as const,
      thumbnail: post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' ? post.thumbnail : undefined,
      thumbnailAlt: post.title
    }))
  } catch (error) {
    console.error('Failed to fetch Reddit:', error)
    return []
  }
}

function calculateNormalizedScore(article: Article): number {
  // Logarithmic scaling to compress score differences
  const logScore = Math.log10(Math.max(article.score, 1))
  
  // Different scaling factors based on typical score ranges
  // HN: typically 50-500 points, Reddit: typically 1000-50000 points
  const scalingFactor = article.source === 'hackernews' ? 3.5 : 1.0
  
  // Recency bonus: more recent articles get a small boost
  const hoursOld = (Date.now() / 1000 - article.timestamp) / 3600
  const recencyBonus = Math.max(0, 1 - hoursOld / 24) * 0.2 // 0.2 bonus that decays over 24 hours
  
  return logScore * scalingFactor + recencyBonus
}

async function fetchAllArticles(): Promise<Article[]> {
  const [hackerNewsArticles, redditArticles] = await Promise.all([
    fetchHackerNewsTop(),
    fetchRedditTop()
  ])
  
  const allArticles = [...hackerNewsArticles, ...redditArticles]
  
  // Sort by normalized score to better mix the sources
  return allArticles.sort((a, b) => calculateNormalizedScore(b) - calculateNormalizedScore(a))
}

export default async function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 pb-8">
      
      <Suspense fallback={
        <div className="space-y-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-100 rounded mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      }>
        <ArticleList articles={await fetchAllArticles()} />
      </Suspense>
    </div>
  )
}