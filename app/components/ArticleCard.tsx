import { Article } from '@/lib/types'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <article className="border-b border-gray-100 py-6 first:pt-0 last:border-b-0">
      <div className="space-y-2">
        <h2 className="text-xl font-medium text-black leading-tight">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors"
          >
            {article.title}
          </a>
        </h2>
        
        {article.description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {article.description}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{article.score} points</span>
          <span>by {article.author}</span>
          <span>{formatDate(article.timestamp)}</span>
          <span className="capitalize">{article.source}</span>
        </div>
      </div>
    </article>
  )
}