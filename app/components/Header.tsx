import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-black">
            CodeCurrent
          </Link>
          <p className="text-gray-600 text-sm">
            Current tech, curated daily
          </p>
        </div>
      </div>
    </header>
  )
}