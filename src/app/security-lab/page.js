// src/app/security-lab/page.js
// Security Testing Lab - Interactive security scanning and vulnerability assessment

import Link from 'next/link'
import SecurityScanner from '../../components/SecurityScanner'

export const metadata = {
  title: 'Security Testing Lab - Yusuf Aslan SDET Portfolio',
  description: 'Interactive security testing lab featuring vulnerability scanning, OWASP Top 10 analysis, security headers validation, and penetration testing demonstrations.',
  keywords: 'security testing, vulnerability scanning, OWASP Top 10, penetration testing, security automation, SDET portfolio',
  openGraph: {
    title: 'Security Testing Lab - Interactive Vulnerability Scanner',
    description: 'Live security testing demonstrations with real vulnerability scanning and security analysis',
    type: 'website',
  },
}

export default function SecurityLabPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navigation */}
      <nav className="bg-white px-6 py-6 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold hover:text-blue-600 transition-colors">
            ← Yusuf Aslan
          </Link>
          <div className="hidden md:flex space-x-8 text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <Link href="/playwright-lab" className="hover:text-gray-900 transition-colors">Playwright Lab</Link>
            <Link href="/performance-lab" className="hover:text-gray-900 transition-colors">Performance Lab</Link>
            <Link href="/api-testing" className="hover:text-gray-900 transition-colors">API Testing</Link>
            <a href="/security-lab" className="text-red-600 font-medium">Security Lab</a>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-6xl mb-6">🔐</div>
          <h1 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">
            Security Testing Laboratory
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Professional security testing demonstrations featuring real-time vulnerability scanning, 
            OWASP Top 10 analysis, security headers validation, and comprehensive security reporting.
          </p>
          
          {/* Key Features */}
          <div className="grid md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-semibold text-gray-900 mb-2">Vulnerability Scanning</h3>
              <p className="text-sm text-gray-600">Automated detection of security vulnerabilities and weaknesses</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-semibold text-gray-900 mb-2">OWASP Top 10</h3>
              <p className="text-sm text-gray-600">Comprehensive testing against the OWASP Top 10 security risks</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">Security Headers</h3>
              <p className="text-sm text-gray-600">Analysis of security headers and HTTPS configuration</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Risk Assessment</h3>
              <p className="text-sm text-gray-600">Professional security scoring and risk level analysis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Security Scanner */}
      <div className="px-6 py-16">
        <SecurityScanner />
      </div>

      {/* Security Testing Methodology */}
      <div className="bg-white px-6 py-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 text-gray-900">
            Security Testing Methodology
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Reconnaissance</h3>
              <p className="text-gray-600">
                Initial target analysis including technology stack identification, 
                security header enumeration, and SSL/TLS configuration assessment.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Vulnerability Assessment</h3>
              <p className="text-gray-600">
                Automated testing for common vulnerabilities including SQL injection, 
                XSS, CSRF, and other OWASP Top 10 security risks.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Reporting</h3>
              <p className="text-gray-600">
                Comprehensive security assessment with risk scoring, detailed findings, 
                and actionable remediation recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* OWASP Top 10 Coverage */}
      <div className="bg-gray-50 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 text-gray-900">
            OWASP Top 10 Coverage
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { id: 'A01', name: 'Broken Access Control', icon: '🚪' },
              { id: 'A02', name: 'Cryptographic Failures', icon: '🔐' },
              { id: 'A03', name: 'Injection', icon: '💉' },
              { id: 'A04', name: 'Insecure Design', icon: '🏗️' },
              { id: 'A05', name: 'Security Misconfiguration', icon: '⚙️' },
              { id: 'A06', name: 'Vulnerable Components', icon: '🧩' },
              { id: 'A07', name: 'Authentication Failures', icon: '🔑' },
              { id: 'A08', name: 'Software Data Integrity', icon: '📦' },
              { id: 'A09', name: 'Logging & Monitoring', icon: '📊' },
              { id: 'A10', name: 'Server-Side Request Forgery', icon: '🌐' }
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-semibold text-red-600 text-sm">{item.id}</div>
                <div className="text-xs text-gray-600 mt-1">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Professional Disclaimer */}
      <div className="bg-blue-50 border-t border-blue-200 px-6 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-blue-600 mb-4">
            <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Professional Security Testing Demonstration</h3>
          <p className="text-blue-700 text-sm max-w-2xl mx-auto">
            This security lab demonstrates professional security testing methodologies and tools. 
            All scans are simulated for portfolio purposes and do not perform actual penetration testing. 
            Real security assessments should only be conducted with proper authorization.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white px-6 py-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Security Testing</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Vulnerability Scanning</a></li>
                <li><a href="#" className="hover:text-gray-900">Penetration Testing</a></li>
                <li><a href="#" className="hover:text-gray-900">Security Automation</a></li>
                <li><a href="#" className="hover:text-gray-900">OWASP Testing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Other Labs</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/playwright-lab" className="hover:text-gray-900">Playwright Testing</a></li>
                <li><a href="/performance-lab" className="hover:text-gray-900">Performance Testing</a></li>
                <li><a href="/api-testing" className="hover:text-gray-900">API Testing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Technologies</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Burp Suite</li>
                <li>OWASP ZAP</li>
                <li>Nmap</li>
                <li>Custom Security Tools</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/" className="hover:text-gray-900">Portfolio Home</Link></li>
                <li><a href="#" className="hover:text-gray-900">LinkedIn</a></li>
                <li><a href="#" className="hover:text-gray-900">GitHub</a></li>
                <li><a href="#" className="hover:text-gray-900">Email</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 text-center">
            <div className="text-gray-600 mb-4">
              © 2025 Yusuf Aslan. Professional SDET Portfolio - Security Testing Specialist.
            </div>
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">← Back to Home</Link>
              <Link href="/playwright-lab" className="text-gray-600 hover:text-gray-900 transition-colors">Playwright Lab</Link>
              <Link href="/performance-lab" className="text-gray-600 hover:text-gray-900 transition-colors">Performance Lab</Link>
              <Link href="/api-testing" className="text-gray-600 hover:text-gray-900 transition-colors">API Testing</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}