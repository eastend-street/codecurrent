import { Article } from '@/lib/types'
import ArticleCard from './ArticleCard'
import FeaturedArticleCard from './FeaturedArticleCard'

interface ArticleListProps {
  articles: Article[]
}

export default function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No articles found.
      </div>
    )
  }

  const [firstArticle, ...remainingArticles] = articles

  return (
    <div>
      {/* Featured Article (only if it has a thumbnail) */}
      {firstArticle.thumbnail ? (
        <FeaturedArticleCard article={firstArticle} />
      ) : (
        <div className="[&>article]:!border-b [&>article]:!border-gray-100">
          <ArticleCard article={firstArticle} />
        </div>
      )}
      
      {/* Regular Articles */}
      <div className="space-y-0">
        {remainingArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}