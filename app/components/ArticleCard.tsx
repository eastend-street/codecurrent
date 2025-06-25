'use client'

import { Article } from '@/lib/types'
import Image from 'next/image'

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
    <article className="border-b border-gray-100 py-4 md:py-6 last:border-b-0 hover:bg-gray-50 transition-colors -mx-4 md:-mx-8 px-4 md:px-8">
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        {/* Row 1: Title and Thumbnail */}
        <div className="flex gap-3 items-start mb-2">
          <h2 className="flex-1 text-lg font-medium text-black leading-tight">
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-700 transition-colors"
            >
              {article.title}
            </a>
          </h2>
          <div className="flex-shrink-0 w-[60px] h-[45px]">
            {article.thumbnail && (
              <Image
                src={article.thumbnail}
                alt={article.thumbnailAlt || article.title}
                width={60}
                height={45}
                className="rounded object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
          </div>
        </div>
        
        {/* Description for mobile */}
        {article.description && (
          <p className="text-gray-600 text-xs leading-relaxed mb-2">
            {article.description}
          </p>
        )}
        
        {/* Row 2: Source, Author, Date */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white`} style={
            article.source === 'hackernews' 
              ? { backgroundColor: '#FF6600' }
              : { backgroundColor: '#FF4500' }
          }>
            {article.source === 'hackernews' ? 'Hacker News' : 'Reddit'}
          </span>
          <span>by {article.author}</span>
          <span>{formatDate(article.timestamp)}</span>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex gap-4 items-start">
        <div className="flex-1 space-y-2">
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
            <p className="text-gray-600 text-xs leading-relaxed">
              {article.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white`} style={
              article.source === 'hackernews' 
                ? { backgroundColor: '#FF6600' }
                : { backgroundColor: '#FF4500' }
            }>
              {article.source === 'hackernews' ? 'Hacker News' : 'Reddit'}
            </span>
            <span>by {article.author}</span>
            <span>{formatDate(article.timestamp)}</span>
          </div>
        </div>
        
        <div className="flex-shrink-0 w-[120px] h-[80px]">
          {article.thumbnail && (
            <Image
              src={article.thumbnail}
              alt={article.thumbnailAlt || article.title}
              width={120}
              height={80}
              className="rounded-lg object-cover w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}
        </div>
      </div>
    </article>
  )
}