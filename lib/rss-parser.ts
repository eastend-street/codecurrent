import Parser from 'rss-parser'
import { BlogPost } from './types'

const parser = new Parser()

export async function parseRSSFeed(feedUrl: string): Promise<BlogPost[]> {
  try {
    // Add caching similar to other sources
    const response = await fetch(feedUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'User-Agent': 'CodeCurrent RSS Reader'
      }
    })
    
    if (!response.ok) {
      console.error(`Failed to fetch RSS feed ${feedUrl}: ${response.status}`)
      return []
    }
    
    const xmlText = await response.text()
    const feed = await parser.parseString(xmlText)
    
    return feed.items.slice(0, 10).map((item): BlogPost => ({
      title: item.title || 'Untitled',
      link: item.link || '',
      description: item.contentSnippet || item.content || '',
      author: item.creator || item['dc:creator'] || 'Unknown',
      pubDate: item.pubDate || item.isoDate || '',
      content: item.content || item.contentSnippet || ''
    }))
  } catch (error) {
    console.error(`Error parsing RSS feed ${feedUrl}:`, error)
    return []
  }
}