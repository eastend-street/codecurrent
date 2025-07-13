import { Suspense } from 'react'
import { Article } from '@/lib/types'
import ArticleList from './components/ArticleList'
import TabNavigation from './components/TabNavigation'
import { getHackerNewsTop } from './queries/getHackerNewsTop'
import { getRedditTop } from './queries/getRedditTop'
import { getBlogsTop } from './queries/getBlogsTop'
import { calculateNormalizedScore } from './utils/scoring'

async function fetchArticles(tab: 'all' | 'hackernews' | 'reddit' | 'blogs'): Promise<Article[]> {
  if (tab === 'hackernews') {
    const articles = await getHackerNewsTop()
    return articles.slice(0, 20)
  }
  
  if (tab === 'reddit') {
    const articles = await getRedditTop()
    return articles.slice(0, 20)
  }
  
  if (tab === 'blogs') {
    const articles = await getBlogsTop()
    return articles.slice(0, 10) // Only 10 for blogs
  }
  
  // tab === 'all'
  const [hackerNewsArticles, redditArticles] = await Promise.all([
    getHackerNewsTop(),
    getRedditTop()
  ])
  
  const allArticles = [...hackerNewsArticles, ...redditArticles]
  
  // Sort by normalized score to better mix the sources
  return allArticles.sort((a, b) => calculateNormalizedScore(b) - calculateNormalizedScore(a)).slice(0, 20)
}

interface HomeProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams
  const tab = (resolvedSearchParams.tab === 'hackernews' || resolvedSearchParams.tab === 'reddit' || resolvedSearchParams.tab === 'blogs') 
    ? resolvedSearchParams.tab 
    : 'all'
  
  return (
    <>
      <TabNavigation activeTab={tab} />
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8">
        <Suspense fallback={
          <div className="space-y-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-100 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        }>
          <ArticleList articles={await fetchArticles(tab)} />
        </Suspense>
      </div>
    </>
  )
}
