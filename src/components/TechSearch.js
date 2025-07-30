'use client'
import { useState } from 'react'

const technologies = [
  { name: 'Playwright', category: 'Testing' },
  { name: 'Selenium WebDriver', category: 'Testing' },
  { name: 'Jest', category: 'Testing' },
  { name: 'Karate DSL', category: 'Testing' },
  { name: 'k6 Performance Testing', category: 'Performance' },
  { name: 'Burp Suite', category: 'Security' },
  { name: 'JavaScript', category: 'Languages' },
  { name: 'TypeScript', category: 'Languages' },
  { name: 'Java', category: 'Languages' },
  { name: 'GitHub Actions', category: 'CI/CD' },
  { name: 'Jenkins', category: 'CI/CD' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Kubernetes', category: 'DevOps' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'SQL', category: 'Database' },
  { name: 'REST APIs', category: 'API' },
  { name: 'Postman', category: 'API' },
  { name: 'JIRA', category: 'Tools' },
  { name: 'TestRail', category: 'Tools' },
  { name: 'BrowserStack', category: 'Testing' },
  { name: 'Linux', category: 'OS' },
  { name: 'Wireshark', category: 'Networking' },
  { name: 'TCP/IP', category: 'Networking' },
]

const categories = ['All', 'Testing', 'Languages', 'CI/CD', 'DevOps', 'Cloud', 'Database', 'API', 'Tools', 'Performance', 'Security', 'OS', 'Networking']

export default function TechSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || tech.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-light mb-6">Technical Skills</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Search through my technology stack by category
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search technologies..."
            className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-center text-gray-600">
        Showing {filteredTechnologies.length} of {technologies.length} technologies
      </div>

      {/* Technology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechnologies.map((tech, index) => (
          <div
            key={tech.name}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
            style={{
                animationDelay: `${index * 50}ms`,
                animationName: 'fadeInUp',
                animationDuration: '0.5s',
                animationTimingFunction: 'ease-out',
                animationFillMode: 'forwards'
            }}
          >
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{tech.name}</h3>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full inline-block">
              {tech.category}
            </div>
          </div>
        ))}
      </div>

      {/* No Results State */}
      {filteredTechnologies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No technologies found</h3>
          <p className="text-gray-600">Try adjusting your search term or category filter</p>
        </div>
      )}

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}