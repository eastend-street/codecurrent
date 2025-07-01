import { Article } from '@/lib/types'

export function calculateNormalizedScore(article: Article): number {
  // Logarithmic scaling to compress score differences
  const logScore = Math.log10(Math.max(article.score, 1))
  
  // Different scaling factors based on typical score ranges
  // HN: typically 50-500 points, Reddit: typically 1000-50000 points
  const scalingFactor = article.source === 'hackernews' ? 3.5 : 1.0
  
  // Recency bonus: more recent articles get a small boost
  const hoursOld = (Date.now() / 1000 - article.timestamp) / 3600
  const recencyBonus = Math.max(0, 1 - hoursOld / 24) * 0.2 // 0.2 bonus that decays over 24 hours
  
  return logScore * scalingFactor + recencyBonus
}
