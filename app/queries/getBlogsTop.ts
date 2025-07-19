import { Article, BlogConfig } from '@/lib/types'
import { parseRSSFeed } from '@/lib/rss-parser'
import { extractThumbnails } from '@/lib/thumbnail'
import blogsConfig from '@/data/blogs.json'
import { balanceArticleSelection } from '@/app/utils/blogBalancing'

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
    
    // Convert to Article format
    const articles: Article[] = allPosts
      .filter(({ post }) => post.pubDate)
      .map(({ post, blog }) => ({
        id: `blog-${blog.name}-${post.link}`,
        title: post.title,
        url: post.link,
        score: 0, // Blogs don't have scores, we'll sort by date
        author: post.author || 'Unknown',
        timestamp: Math.floor(new Date(post.pubDate || 0).getTime() / 1000),
        description: undefined, // Don't show descriptions for blog articles
        source: 'blog' as const,
        blogName: blog.name,
        thumbnail: undefined, // Placeholder for thumbnail
        thumbnailAlt: undefined,
      }));

    // Balance the articles to ensure diversity
    const balancedArticles = balanceArticleSelection(articles, {
      maxArticlesPerBlog: 3,
      totalArticles: 10,
    });

    // Extract thumbnails for the balanced posts
    const urlObjects = balancedArticles.map((article) => ({ url: article.url }))
    const thumbnails = await extractThumbnails(urlObjects)

    // Add thumbnails to the balanced articles
    const finalArticles = balancedArticles.map((article, index) => ({
      ...article,
      thumbnail: thumbnails[index]?.url,
      thumbnailAlt: thumbnails[index]?.alt,
    }));
    
    return finalArticles
  } catch (error) {
    console.error('Error fetching blog articles:', error)
    return []
  }
}