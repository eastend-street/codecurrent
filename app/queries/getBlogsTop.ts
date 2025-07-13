import { Article, BlogConfig } from '@/lib/types'
import { parseRSSFeed } from '@/lib/rss-parser'
import { extractThumbnails } from '@/lib/thumbnail'
import blogsConfig from '@/data/blogs.json'

export async function getBlogsTop(): Promise<Article[]> {
  try {
    const blogs: BlogConfig[] = blogsConfig.blogs
    
    // Fetch articles from all blogs
    const blogPromises = blogs.map(async (blog) => {
      try {
        const posts = await parseRSSFeed(blog.feedUrl)
        return posts.map(post => ({ post, blog }))
      } catch (error) {
        console.error(`Failed to fetch from ${blog.name}:`, error)
        return []
      }
    })
    
    const allBlogResults = await Promise.all(blogPromises)
    const allPosts = allBlogResults.flat()
    
    // Sort by publication date and take top 10
    const sortedPosts = allPosts
      .filter(({ post }) => post.pubDate)
      .sort((a, b) => {
        const dateA = new Date(a.post.pubDate || 0).getTime()
        const dateB = new Date(b.post.pubDate || 0).getTime()
        return dateB - dateA // Most recent first
      })
      .slice(0, 10)
    
    // Extract thumbnails for the posts
    const urlObjects = sortedPosts.map(({ post }) => ({ url: post.link }))
    const thumbnails = await extractThumbnails(urlObjects)
    
    // Convert to Article format
    const articles: Article[] = sortedPosts.map(({ post, blog }, index) => ({
      id: `blog-${blog.name}-${post.link}`,
      title: post.title,
      url: post.link,
      score: 0, // Blogs don't have scores, we'll sort by date
      author: post.author || 'Unknown',
      timestamp: Math.floor(new Date(post.pubDate || 0).getTime() / 1000),
      description: undefined, // Don't show descriptions for blog articles
      source: 'blog' as const,
      blogName: blog.name,
      thumbnail: thumbnails[index]?.url,
      thumbnailAlt: thumbnails[index]?.alt
    }))
    
    return articles
  } catch (error) {
    console.error('Error fetching blog articles:', error)
    return []
  }
}