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
 * Validates blog balance configuration and returns a normalized config
 */
export function validateBlogBalanceConfig(
  config: Partial<BlogBalanceConfig> = {}
): BlogBalanceConfig {
  const validatedConfig: BlogBalanceConfig = {
    ...DEFAULT_BLOG_BALANCE_CONFIG,
    ...config,
  };

  // Validate maxArticlesPerBlog
  if (!Number.isInteger(validatedConfig.maxArticlesPerBlog) || validatedConfig.maxArticlesPerBlog < 1) {
    console.warn(
      'maxArticlesPerBlog must be a positive integer, using default:',
      DEFAULT_BLOG_BALANCE_CONFIG.maxArticlesPerBlog
    );
    validatedConfig.maxArticlesPerBlog = DEFAULT_BLOG_BALANCE_CONFIG.maxArticlesPerBlog;
  }

  // Validate totalArticles
  if (!Number.isInteger(validatedConfig.totalArticles) || validatedConfig.totalArticles < 1) {
    console.warn(
      'totalArticles must be a positive integer, using default:',
      DEFAULT_BLOG_BALANCE_CONFIG.totalArticles
    );
    validatedConfig.totalArticles = DEFAULT_BLOG_BALANCE_CONFIG.totalArticles;
  }

  // Validate fallbackToChronological
  if (typeof validatedConfig.fallbackToChronological !== 'boolean') {
    console.warn(
      'fallbackToChronological must be a boolean, using default:',
      DEFAULT_BLOG_BALANCE_CONFIG.fallbackToChronological
    );
    validatedConfig.fallbackToChronological = DEFAULT_BLOG_BALANCE_CONFIG.fallbackToChronological;
  }

  // Ensure maxArticlesPerBlog doesn't exceed totalArticles
  if (validatedConfig.maxArticlesPerBlog > validatedConfig.totalArticles) {
    console.warn(
      'maxArticlesPerBlog cannot exceed totalArticles, adjusting maxArticlesPerBlog to:',
      validatedConfig.totalArticles
    );
    validatedConfig.maxArticlesPerBlog = validatedConfig.totalArticles;
  }

  return validatedConfig;
}

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
  config: Partial<BlogBalanceConfig> = DEFAULT_BLOG_BALANCE_CONFIG
): Article[] {
  try {
    // Validate and normalize configuration
    const validatedConfig = validateBlogBalanceConfig(config);
    // Handle edge cases
    if (articles.length === 0) {
      return [];
    }

    if (articles.length <= validatedConfig.totalArticles) {
      // If we have fewer articles than requested, return all sorted chronologically
      return articles.sort((a, b) => b.timestamp - a.timestamp);
    }

    // Group articles by blog
    const blogGroups = groupArticlesByBlog(articles);

    // Handle single blog case
    if (blogGroups.length === 1) {
      const singleGroup = blogGroups[0];
      return singleGroup.articles
        .slice(0, Math.min(validatedConfig.totalArticles, validatedConfig.maxArticlesPerBlog))
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
      selectedArticles.length < validatedConfig.totalArticles &&
      blogQueues.some((queue) => queue.articles.length > 0)
    ) {
      // Process each queue in round-robin fashion using forEach
      blogQueues.forEach((queue) => {
        // Skip if this blog has reached its quota, has no more articles, or we've hit the limit
        if (
          queue.selectedCount >= validatedConfig.maxArticlesPerBlog ||
          queue.articles.length === 0 ||
          selectedArticles.length >= validatedConfig.totalArticles
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

    // Validate config for fallback behavior
    const validatedConfig = validateBlogBalanceConfig(config);
    
    if (validatedConfig.fallbackToChronological) {
      return articles
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, validatedConfig.totalArticles);
    }

    return [];
  }
}
