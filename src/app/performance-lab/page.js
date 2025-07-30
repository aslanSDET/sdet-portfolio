// src/app/performance-lab/page.js

import Link from 'next/link'
import PerformanceLab from '../../components/PerformanceLab'

export default function PerformanceLabPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="px-6 py-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold hover:text-blue-600 transition-colors">
            ← Yusuf Aslan
          </Link>
          <div className="hidden md:flex space-x-8 text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <Link href="/playwright-lab" className="hover:text-gray-900 transition-colors">Playwright Lab</Link>
            <Link href="/api-testing" className="hover:text-gray-900 transition-colors">API Testing</Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="px-6 py-20">
        <PerformanceLab />
      </div>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-600 mb-4">
            © 2025 Yusuf Aslan. Built with Next.js and tested with Playwright.
          </div>
          <div className="flex justify-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">← Back to Home</Link>
            <Link href="/playwright-lab" className="text-gray-600 hover:text-gray-900 transition-colors">Playwright Lab</Link>
            <Link href="/api-testing" className="text-gray-600 hover:text-gray-900 transition-colors">API Testing</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}