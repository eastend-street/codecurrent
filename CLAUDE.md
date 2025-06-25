# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Next.js 15 application called "CodeCurrent" that aggregates tech news from Hacker News and Reddit. The main application code is in the `codecurrent/` directory.

Key directories:
- `app/` - Next.js App Router structure with pages and components
- `app/components/` - React components (ArticleCard, ArticleList, TabNavigation, Header, Footer)
- `lib/` - Shared utilities and TypeScript type definitions
- `public/` - Static assets

## Development Commands

Working directory: `codecurrent/`

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Data Flow
1. Main page (`app/page.tsx`) handles data fetching from external APIs
2. Two data sources: Hacker News Firebase API and Reddit JSON API
3. Data is normalized to a common `Article` interface defined in `lib/types.ts`
4. Articles are displayed via `ArticleList` -> `ArticleCard` component hierarchy

### Components
- `TabNavigation` - Switch between Hacker News and Reddit sources
- `ArticleList` - Container for article cards with loading states
- `ArticleCard` - Individual article display with title, score, author, date

### State Management
- Uses URL search parameters (`?tab=`) for tab state
- Server-side data fetching with React Suspense for loading states
- No client-side state management library

### Styling
- Tailwind CSS v4 with PostCSS configuration
- Clean, minimal design with gray/black color scheme
- Responsive layout with max-width container

### API Integration
- Fetches top 10 stories from Hacker News API
- Fetches from multiple tech-focused subreddits (programming, technology, webdev, etc.)
- Error handling with fallback to empty arrays
- External links open in new tabs

## Type Definitions

Core types in `lib/types.ts`:
- `Article` - Normalized article format used throughout app
- `HackerNewsItem` - Raw Hacker News API response structure  
- `RedditPost` - Raw Reddit API response structure
- `TabType` - Union type for tab selection