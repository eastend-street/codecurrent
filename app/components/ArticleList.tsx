import { Article } from '@/lib/types'
import ArticleCard from './ArticleCard'

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

  return (
    <div className="space-y-0">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}