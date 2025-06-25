import Link from 'next/link'
import { TabType } from '@/lib/types'

interface TabNavigationProps {
  activeTab: TabType
}

export default function TabNavigation({ activeTab }: TabNavigationProps) {
  const tabs = [
    { id: 'hackernews' as TabType, label: 'Hacker News' },
    { id: 'reddit' as TabType, label: 'Reddit' }
  ]

  return (
    <nav className="border-b border-gray-200 mb-8">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/?tab=${tab.id}`}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}