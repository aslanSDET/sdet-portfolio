// src/app/page.js
// Clean, minimal homepage with navigation to testing labs

import TechSearch from '../components/TechSearch'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="px-6 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xl font-semibold">Yusuf Aslan</div>
          <div className="hidden md:flex space-x-8 text-gray-600">
            <a href="#work" className="hover:text-gray-900 transition-colors">Work</a>
            <a href="#about" className="hover:text-gray-900 transition-colors">About</a>
            <a href="#testing" className="hover:text-gray-900 transition-colors">Testing Lab</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-light mb-8 leading-tight">
            Senior Test
            <br />
            <span className="font-medium">Automation Engineer</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            I architect testing frameworks that scale. From startup to enterprise, 
            I build the quality infrastructure that enables teams to ship with confidence.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="#testing" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-colors">
              Explore Testing Labs
            </a>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-medium transition-colors">
              Download Resume
            </button>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-center mb-16">Experience</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-5xl font-light text-blue-600 mb-4">8+</div>
              <h3 className="text-lg font-medium mb-2">Years Experience</h3>
              <p className="text-gray-600">Across startup to Fortune 500 environments</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-light text-blue-600 mb-4">3</div>
              <h3 className="text-lg font-medium mb-2">Major Companies</h3>
              <p className="text-gray-600">FloQast, Credly, Comcast</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-light text-blue-600 mb-4">∞</div>
              <h3 className="text-lg font-medium mb-2">Frameworks Built</h3>
              <p className="text-gray-600">From zero to production-ready systems</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testing Lab Selection */}
      <div id="testing" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6">Testing Lab</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your testing adventure. Each lab demonstrates different aspects of my SDET expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Live Playwright Demo */}
            <a href="/playwright-lab" className="group bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200 hover:scale-105 block">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-2xl font-medium mb-4 group-hover:text-blue-600 transition-colors">Live Playwright Testing</h3>
              <p className="text-gray-600 mb-6">
                Watch real Playwright tests execute across multiple browsers with live screenshots and detailed reporting.
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                Run Live Tests →
              </div>
            </a>

            {/* Performance Testing */}
            <a href="/performance-lab" className="group bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200 hover:scale-105 block">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-medium mb-4 group-hover:text-blue-600 transition-colors">k6 Performance Lab</h3>
              <p className="text-gray-600 mb-6">
                Interactive load testing with real-time metrics, charts, and performance analysis dashboards.
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                Launch k6 Tests →
              </div>
            </a>

            {/* API Testing */}
            <a href="/api-testing" className="group bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200 hover:scale-105 block">
              <div className="text-4xl mb-4">🔌</div>
              <h3 className="text-2xl font-medium mb-4 group-hover:text-blue-600 transition-colors">API Testing Playground</h3>
              <p className="text-gray-600 mb-6">
                Interactive REST API testing with validation, security analysis, and comprehensive reporting.
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                Test APIs Live →
              </div>
            </a>

            {/* Security Testing */}
            <a href="/security-lab" className="group bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200 hover:scale-105 block">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-2xl font-medium mb-4 group-hover:text-blue-600 transition-colors">Security Scanner</h3>
              <p className="text-gray-600 mb-6">
                Automated vulnerability detection and security testing demonstrations.
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                Security Tests →
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Technologies Section */}
      <div className="px-6 py-20 bg-gray-50">
        <TechSearch />
      </div>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-600 mb-4">
            © 2025 Yusuf Aslan. Built with Next.js and tested with Playwright.
          </div>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">GitHub</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">LinkedIn</a>
            <a href="mailto:yusufzafera@gmail.com" className="text-gray-600 hover:text-gray-900 transition-colors">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}