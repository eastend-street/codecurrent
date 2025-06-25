# CodeCurrent

A modern tech news aggregator that brings together the best stories from Hacker News and Reddit in one clean, readable interface.

## Features

- **Dual Source Aggregation**: Fetches top stories from Hacker News and multiple tech-focused subreddits
- **Smart Article Thumbnails**: Automatically extracts Open Graph images from article URLs
- **Featured Article Layout**: Hero-style layout for the top article with large imagery
- **Responsive Mobile Design**: Optimized layouts for both mobile and desktop viewing
- **Unified Feed**: Intelligent scoring system blends articles from both sources
- **Clean Interface**: The Verge-inspired design with focus on readability
- **External Links**: Articles open in new tabs to preserve your browsing session

## Tech Stack

- **Next.js 15** with App Router
- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Server-side rendering** for optimal performance

## Data Sources

- **Hacker News**: Top 15 stories via Firebase API
- **Reddit**: Top 15 stories from tech-focused subreddits including r/programming, r/technology, r/webdev, r/MachineLearning, r/startups, and more
- **Final Output**: Top 20 articles selected using normalized scoring algorithm that balances recency and engagement

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the app

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
app/
├── components/              # React components
│   ├── ArticleCard.tsx     # Regular article display
│   ├── FeaturedArticleCard.tsx # Hero article layout
│   ├── ArticleList.tsx     # Article container with featured logic
│   ├── Header.tsx          # App header
│   └── Footer.tsx          # App footer
├── page.tsx                # Main page with data fetching
└── layout.tsx              # Root layout
lib/
├── types.ts                # TypeScript definitions
└── thumbnail.ts            # Thumbnail extraction utilities
```

## Contributing

This project follows standard Next.js conventions. See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines.
