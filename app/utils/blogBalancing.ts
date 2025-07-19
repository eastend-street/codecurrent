import { Article } from '../../lib/types';

/**
 * Configuration for blog article balancing
 */
export interface BlogBalanceConfig {
  /** Maximum number of articles to show per blog source */
  maxArticlesPerBlog: number;
  /** Total number of articles to return */
  totalArticles: number;
  /** Whether to fall back to chronological sorting if balancing fails */
  fallbackToChronological: boolean;
}

/**
 * Grouped articles by blog name
 */
export interface BlogArticleGroup {
  blogName: string;
  articles: Article[];
}

/**
 * Default configuration for blog balancing
 */
export const DEFAULT_BLOG_BALANCE_CONFIG: BlogBalanceConfig = {
  maxArticlesPerBlog: 2,
  totalArticles: 10,
  fallbackToChronological: true,
};

/**
 * Groups articles by blog name, sorting each group chronologically (newest first)
 */
function groupArticlesByBlog(articles: Article[]): BlogArticleGroup[] {
  // Group articles by blog name using reduce
  const groups = articles.reduce((acc, article) => {
    const blogName = article.blogName || 'Unknown';
    if (!acc.has(blogName)) {
      acc.set(blogName, []);
    }
    acc.get(blogName)!.push(article);
    return acc;
  }, new Map<string, Article[]>());

  // Convert to sorted groups using Array.from and map
  return Array.from(groups.entries()).map(([blogName, groupArticles]) => ({
    blogName,
    articles: groupArticles.sort((a, b) => b.timestamp - a.timestamp),
  }));
}

/**
 * Implements round-robin selection to balance articles across blog sources
 */
export function balanceArticleSelection(
  articles: Article[],
  config: BlogBalanceConfig = DEFAULT_BLOG_BALANCE_CONFIG
): Article[] {
  try {
    // Handle edge cases
    if (articles.length === 0) {
      return [];
    }

    if (articles.length <= config.totalArticles) {
      // If we have fewer articles than requested, return all sorted chronologically
      return articles.sort((a, b) => b.timestamp - a.timestamp);
    }

    // Group articles by blog
    const blogGroups = groupArticlesByBlog(articles);

    // Handle single blog case
    if (blogGroups.length === 1) {
      const singleGroup = blogGroups[0];
      return singleGroup.articles
        .slice(0, Math.min(config.totalArticles, config.maxArticlesPerBlog))
        .sort((a, b) => b.timestamp - a.timestamp);
    }

    // Round-robin selection algorithm
    const selectedArticles: Article[] = [];
    const blogQueues = blogGroups.map((group) => ({
      blogName: group.blogName,
      articles: [...group.articles], // Create a copy to avoid mutation
      selectedCount: 0,
    }));

    // Continue round-robin until we have enough articles or exhaust all sources
    while (
      selectedArticles.length < config.totalArticles &&
      blogQueues.some((queue) => queue.articles.length > 0)
    ) {
      // Process each queue in round-robin fashion using forEach
      blogQueues.forEach((queue) => {
        // Skip if this blog has reached its quota, has no more articles, or we've hit the limit
        if (
          queue.selectedCount >= config.maxArticlesPerBlog ||
          queue.articles.length === 0 ||
          selectedArticles.length >= config.totalArticles
        ) {
          return; // Continue to next queue
        }

        // Take the next article from this blog
        const article = queue.articles.shift()!;
        selectedArticles.push(article);
        queue.selectedCount++;
      });
    }

    // Sort final selection chronologically while maintaining diversity
    return selectedArticles.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.warn(
      'Blog balancing failed, falling back to chronological sorting:',
      error
    );

    if (config.fallbackToChronological) {
      return articles
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, config.totalArticles);
    }

    return [];
  }
}
