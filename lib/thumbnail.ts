interface ThumbnailResult {
  url?: string
  alt?: string
}

export async function extractThumbnail(articleUrl: string): Promise<ThumbnailResult> {
  try {
    // Set a timeout for the fetch request
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(articleUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CodeCurrent/1.0; +https://codecurrent.com)'
      }
    })

    clearTimeout(timeout)

    if (!response.ok) {
      return {}
    }

    const html = await response.text()
    
    // Extract Open Graph image
    const ogImageMatch = html.match(/<meta\s+property=['"]og:image['"][^>]*content=['"]([^'"]+)['"][^>]*>/i)
    if (ogImageMatch) {
      const ogImage = ogImageMatch[1]
      
      // Extract Open Graph image alt text
      const ogImageAltMatch = html.match(/<meta\s+property=['"]og:image:alt['"][^>]*content=['"]([^'"]+)['"][^>]*>/i)
      const ogImageAlt = ogImageAltMatch ? ogImageAltMatch[1] : undefined
      
      return {
        url: ogImage,
        alt: ogImageAlt
      }
    }

    // Fall back to Twitter Card image
    const twitterImageMatch = html.match(/<meta\s+name=['"]twitter:image['"][^>]*content=['"]([^'"]+)['"][^>]*>/i)
    if (twitterImageMatch) {
      const twitterImage = twitterImageMatch[1]
      
      // Extract Twitter image alt text
      const twitterImageAltMatch = html.match(/<meta\s+name=['"]twitter:image:alt['"][^>]*content=['"]([^'"]+)['"][^>]*>/i)
      const twitterImageAlt = twitterImageAltMatch ? twitterImageAltMatch[1] : undefined
      
      return {
        url: twitterImage,
        alt: twitterImageAlt
      }
    }

    // Fall back to standard meta image
    const metaImageMatch = html.match(/<meta\s+name=['"]image['"][^>]*content=['"]([^'"]+)['"][^>]*>/i)
    if (metaImageMatch) {
      return {
        url: metaImageMatch[1]
      }
    }

    return {}
  } catch (error) {
    // Handle fetch errors silently - thumbnails are optional
    console.warn(`Failed to extract thumbnail from ${articleUrl}:`, error)
    return {}
  }
}

export async function extractThumbnails(articles: Array<{ url: string }>): Promise<ThumbnailResult[]> {
  // Extract thumbnails in parallel with a limit to avoid overwhelming servers
  const batchSize = 5
  const results: ThumbnailResult[] = []
  
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(article => extractThumbnail(article.url))
    )
    results.push(...batchResults)
  }
  
  return results
}