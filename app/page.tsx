import { Suspense } from 'react'
import { Article, HackerNewsItem, RedditPost, TabType } from '@/lib/types'
import TabNavigation from './components/TabNavigation'
import ArticleList from './components/ArticleList'

interface SearchParams {
  tab?: string
}

interface HomeProps {
  searchParams: SearchParams
}

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
          return data.data.children.map((child: any) => child.data)
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
      source: 'reddit' as const
    }))
  } catch (error) {
    console.error('Failed to fetch Reddit:', error)
    return []
  }
}

async function ArticleContent({ tab }: { tab: TabType }) {
  const articles = tab === 'reddit' ? await fetchRedditTop() : await fetchHackerNewsTop()
  
  return <ArticleList articles={articles} />
}

export default function Home({ searchParams }: HomeProps) {
  const activeTab: TabType = (searchParams.tab as TabType) || 'hackernews'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">
          Latest Tech News
        </h1>
        <p className="text-gray-600">
          Top stories from Hacker News and Reddit tech communities
        </p>
      </div>

      <TabNavigation activeTab={activeTab} />
      
      <Suspense fallback={
        <div className="space-y-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-100 rounded mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      }>
        <ArticleContent tab={activeTab} />
      </Suspense>
    </div>
  )
}