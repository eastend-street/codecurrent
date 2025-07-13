import Link from 'next/link'

interface TabNavigationProps {
  activeTab: 'all' | 'hackernews' | 'reddit'
}

export default function TabNavigation({ activeTab }: TabNavigationProps) {
  const tabs = [
    { id: 'all' as const, label: 'All', href: '/' },
    { id: 'hackernews' as const, label: 'Hacker News', href: '/?tab=hackernews' },
    { id: 'reddit' as const, label: 'Reddit', href: '/?tab=reddit' }
  ]

  return (
    <div className="bg-white py-3">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <nav className="flex space-x-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-colors min-w-[80px] text-center ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === tab.id ? (
                tab.id === 'hackernews' ? { backgroundColor: '#FF6600' } :
                tab.id === 'reddit' ? { backgroundColor: '#FF4500' } :
                { backgroundColor: '#000000' }
              ) : {}}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}