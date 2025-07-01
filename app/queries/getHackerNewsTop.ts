import { Article, HackerNewsItem } from '@/lib/types'
import { extractThumbnails } from '@/lib/thumbnail'

export async function getHackerNewsTop(): Promise<Article[]> {
  try {
    const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    const topStoryIds = await topStoriesRes.json()
    
    const stories = await Promise.all(
      topStoryIds.slice(0, 15).map(async (id: number) => {
        const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
          next: { revalidate: 3600 } // Revalidate every hour
        })
        return storyRes.json()
      })
    )

    const validStories = stories.filter((story: HackerNewsItem) => story && story.url)
    
    // Extract thumbnails for all valid stories
    const thumbnails = await extractThumbnails(validStories.map(story => ({ url: story.url! })))

    return validStories.map((story: HackerNewsItem, index: number) => ({
      id: story.id.toString(),
      title: story.title,
      url: story.url!,
      score: story.score,
      author: story.by,
      timestamp: story.time,
      source: 'hackernews' as const,
      thumbnail: thumbnails[index]?.url,
      thumbnailAlt: thumbnails[index]?.alt || story.title
    }))
  } catch (error) {
    console.error('Failed to fetch Hacker News:', error)
    return []
  }
}
