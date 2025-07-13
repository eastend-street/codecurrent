'use client'

import { Article } from '@/lib/types'
import Image from 'next/image'

interface FeaturedArticleCardProps {
  article: Article
}

export default function FeaturedArticleCard({ article }: FeaturedArticleCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <article className="relative mb-8 overflow-hidden rounded-none md:rounded-lg bg-black text-white -mx-4 md:mx-0">
      {/* Background Image */}
      {article.thumbnail && (
        <div className="absolute inset-0">
          <Image
            src={article.thumbnail}
            alt={article.thumbnailAlt || article.title}
            fill
            className="object-cover opacity-60"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 p-4 px-4 md:p-8">
        <div className="flex flex-col justify-end min-h-[300px] md:min-h-[400px]">
          <div className="space-y-4">
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition-colors"
              >
                {article.title}
              </a>
            </h1>
            
            {article.description && (
              <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-2xl">
                {article.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className={`px-3 py-1 rounded-full text-sm font-medium text-white`} style={
                article.source === 'hackernews' 
                  ? { backgroundColor: '#FF6600' }
                  : article.source === 'reddit' 
                  ? { backgroundColor: '#FF4500' }
                  : { backgroundColor: '#6366F1' }
              }>
                {article.source === 'hackernews' 
                  ? 'Hacker News' 
                  : article.source === 'reddit' 
                  ? 'Reddit' 
                  : article.blogName || 'Blog'}
              </span>
              <span>by {article.author}</span>
              <span>{formatDate(article.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fallback background if no thumbnail */}
      {!article.thumbnail && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
      )}
    </article>
  )
}