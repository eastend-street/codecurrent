# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Next.js 15 application called "CodeCurrent" that aggregates tech news from Hacker News and Reddit. The main application code is in the root directory.

Key directories:
- `app/` - Next.js App Router structure with pages and components
- `app/components/` - React components (ArticleCard, FeaturedArticleCard, ArticleList, Header, Footer)
- `lib/` - Shared utilities, TypeScript type definitions, and thumbnail extraction
- `public/` - Static assets

## Development Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Data Flow
1. Main page (`app/page.tsx`) handles data fetching from external APIs
2. Two data sources: Hacker News Firebase API and Reddit JSON API
3. Fetches 15 articles from each source (30 total)
4. Thumbnail extraction from article URLs using Open Graph, Twitter Card, and meta tags
5. Data is normalized to a common `Article` interface defined in `lib/types.ts`
6. Intelligent scoring algorithm blends sources and selects top 20 articles
7. Articles are displayed via `ArticleList` with featured/regular layout logic

### Components
- `ArticleList` - Container that handles featured vs regular article display logic
- `FeaturedArticleCard` - Hero-style layout for the first article (when it has thumbnail)
- `ArticleCard` - Regular article display with responsive mobile/desktop layouts
- `Header` & `Footer` - App structure components

### State Management
- Server-side data fetching with React Suspense for loading states
- No client-side state management library
- Responsive layouts using Tailwind CSS breakpoints

### Styling
- Tailwind CSS v4 with PostCSS configuration
- The Verge-inspired design with hero article layout
- Responsive mobile-first design with different layouts for mobile/desktop
- Featured articles: full-width with gradient overlays
- Regular articles: compact rows with thumbnails on right

### API Integration
- Fetches top 15 stories from Hacker News Firebase API
- Fetches from 8 tech-focused subreddits (programming, technology, webdev, MachineLearning, startups, ClaudeAI, ycombinator, cursor)
- Thumbnail extraction with 5-second timeouts and batch processing
- Normalized scoring algorithm balances engagement and recency
- Error handling with fallback to empty arrays
- External links open in new tabs
- Next.js Image optimization with remote pattern allowlist

## Type Definitions

Core types in `lib/types.ts`:
- `Article` - Normalized article format with thumbnail fields
- `HackerNewsItem` - Raw Hacker News API response structure  
- `RedditPost` - Raw Reddit API response structure with thumbnail field

## Thumbnail System

Located in `lib/thumbnail.ts`:
- `extractThumbnail()` - Extracts single thumbnail from URL using Open Graph, Twitter Card, meta tags
- `extractThumbnails()` - Batch processes multiple URLs with rate limiting
- Supports fallback chain: OG image → Twitter image → meta image
- 5-second timeout per request with error handling
- Returns thumbnail URL and alt text when available