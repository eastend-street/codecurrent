# CodeCurrent

A modern tech news aggregator that brings together the best stories from Hacker News and Reddit in one clean, readable interface.

## Features

- **Dual Source Aggregation**: Fetches top stories from Hacker News and multiple tech-focused subreddits
- **Clean Interface**: Medium-inspired design with focus on readability
- **Tab Navigation**: Switch between Hacker News and Reddit content
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **External Links**: Articles open in new tabs to preserve your browsing session

## Tech Stack

- **Next.js 15** with App Router
- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Server-side rendering** for optimal performance

## Data Sources

- **Hacker News**: Top 10 stories via Firebase API
- **Reddit**: Tech-focused subreddits including r/programming, r/technology, r/webdev, and more

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
├── components/          # React components
│   ├── ArticleCard.tsx # Individual article display
│   ├── ArticleList.tsx # Article container
│   ├── TabNavigation.tsx # Source switching
│   ├── Header.tsx      # App header
│   └── Footer.tsx      # App footer
├── page.tsx            # Main page with data fetching
└── layout.tsx          # Root layout
lib/
├── types.ts            # TypeScript definitions
└── utils.ts            # Shared utilities
```

## Contributing

This project follows standard Next.js conventions. See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines.
