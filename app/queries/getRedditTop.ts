import { Article, RedditPost } from '@/lib/types'
import { extractThumbnails } from '@/lib/thumbnail'

export async function getRedditTop(): Promise<Article[]> {
  try {
    const subreddits = ['programming', 'technology', 'webdev', 'MachineLearning', 'startups', 'ClaudeAI', 'ycombinator', 'cursor']
    
    const allPosts = await Promise.all(
      subreddits.map(async (subreddit) => {
        try {
          const res = await fetch(`https://www.reddit.com/r/${subreddit}/top.json?limit=5&t=day`, {
            headers: {
              'User-Agent': 'CodeCurrent/1.0'
            },
            next: { revalidate: 3600 } // Revalidate every hour
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
      .slice(0, 15)

    // Identify posts that need thumbnail extraction
    const postsNeedingThumbnails = posts.filter(post => 
      !post.thumbnail || post.thumbnail === 'self' || post.thumbnail === 'default'
    )
    
    // Extract thumbnails for posts that don't have them
    const extractedThumbnails = postsNeedingThumbnails.length > 0 
      ? await extractThumbnails(postsNeedingThumbnails.map(post => ({ url: post.url })))
      : []

    let thumbnailIndex = 0
    return posts.map((post: RedditPost) => {
      let thumbnail = post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' 
        ? post.thumbnail 
        : undefined
      let thumbnailAlt = post.title

      // If post didn't have a thumbnail, use extracted one
      if (!thumbnail) {
        const extracted = extractedThumbnails[thumbnailIndex++]
        thumbnail = extracted?.url
        thumbnailAlt = extracted?.alt || post.title
      }

      return {
        id: post.id,
        title: post.title,
        url: post.url,
        score: post.score,
        author: post.author,
        timestamp: post.created_utc,
        description: post.selftext ? post.selftext.slice(0, 200) + '...' : undefined,
        source: 'reddit' as const,
        thumbnail,
        thumbnailAlt
      }
    })
  } catch (error) {
    console.error('Failed to fetch Reddit:', error)
    return []
  }
}