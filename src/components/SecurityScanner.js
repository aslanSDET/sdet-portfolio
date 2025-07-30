// src/components/SecurityScanner.js
// Updated version showing clear differences between scan types

'use client'
import { useState } from 'react'

const scanTypes = [
  {
    id: 'quick',
    name: 'Quick Scan',
    description: 'Essential security basics - fast analysis of critical vulnerabilities',
    icon: '⚡',
    duration: '5-10 seconds',
    color: 'blue',
    features: [
      'Core security headers (4 essential)',
      'Basic SSL/TLS validation',
      'Top 4 critical vulnerabilities',
      'Basic risk assessment'
    ]
  },
  {
    id: 'full',
    name: 'Full Security Audit',
    description: 'Comprehensive security analysis including OWASP Top 10 + advanced checks',
    icon: '🔍',
    duration: '15-30 seconds',
    color: 'red',
    features: [
      'All security headers (9 comprehensive)',
      'Complete SSL/TLS + cipher analysis',
      'Full OWASP Top 10 testing',
      'Advanced security checks',
      'Compliance assessment',
      'Detailed remediation guide'
    ]
  }
]

const predefinedTargets = [
  {
    name: 'Secure Example (Good Security)',
    url: 'https://github.com',
    description: 'Well-configured security headers and HTTPS'
  },
  {
    name: 'Test Target (Mixed Security)',
    url: 'https://httpbin.org',
    description: 'Some security features missing - good for testing'
  },
  {
    name: 'HTTP Target (Poor Security)',
    url: 'http://neverssl.com',
    description: 'Demonstrates security issues with HTTP sites'
  }
]

export default function SecurityScanner() {
  const [scanConfig, setScanConfig] = useState({
    targetUrl: 'https://github.com',
    scanType: 'full'
  })
  
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState(null)

  const startSecurityScan = async () => {
    setIsScanning(true)
    setScanResults(null)

    try {
      const response = await fetch('/api/security-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scanConfig)
      })

      const apiResponse = await response.json()
      
      if (apiResponse.success) {
        setScanResults(apiResponse.results)
      } else {
        setScanResults({
          success: false,
          error: apiResponse.error || 'Security scan failed',
          troubleshooting: apiResponse.troubleshooting || [
            'Check if the target URL is accessible',
            'Ensure proper CORS configuration',
            'Try a different target URL'
          ]
        })
      }

    } catch (error) {
      console.error('Security scan failed:', error)
      setScanResults({
        success: false,
        error: error.message,
        troubleshooting: [
          'Check if the target URL is accessible',
          'Ensure proper CORS configuration',
          'Try a different target URL'
        ]
      })
    } finally {
      setIsScanning(false)
    }
  }

  const loadPredefinedTarget = (target) => {
    setScanConfig({ ...scanConfig, targetUrl: target.url })
    setScanResults(null)
  }

  const getScoreColor = (score) => {
    if (!score && score !== 0) return 'text-gray-400'
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getRiskColor = (risk) => {
    if (!risk) return 'bg-gray-100 text-gray-800'
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const resetScan = () => {
    setScanResults(null)
    setIsScanning(false)
  }

  const safeGet = (obj, path, defaultValue = null) => {
    return path.split('.').reduce((current, key) => 
      current && current[key] !== undefined ? current[key] : defaultValue, obj)
  }

  const selectedScanType = scanTypes.find(type => type.id === scanConfig.scanType)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-light mb-6">Security Scanner</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive security analysis including OWASP Top 10 checks, security headers validation, 
          SSL/TLS analysis, and vulnerability detection. Professional security reporting for web applications.
        </p>
      </div>

      {/* Predefined Targets */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Quick Start Targets</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {predefinedTargets.map((target, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900 mb-2">{target.name}</div>
              <p className="text-sm text-gray-600 mb-3">{target.description}</p>
              <button
                onClick={() => loadPredefinedTarget(target)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                disabled={isScanning}
              >
                Load Target →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Scan Configuration */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
        <h3 className="text-xl font-semibold mb-6">Security Scan Configuration</h3>
        
        <div className="space-y-6">
          {/* Target URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target URL</label>
            <input
              type="url"
              value={scanConfig.targetUrl}
              onChange={(e) => setScanConfig({...scanConfig, targetUrl: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
              disabled={isScanning}
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter the URL you want to perform security analysis on
            </p>
          </div>

          {/* Scan Type Selection with detailed comparison */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Scan Type</label>
            <div className="grid md:grid-cols-2 gap-6">
              {scanTypes.map((type) => (
                <div
                  key={type.id}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                    scanConfig.scanType === type.id
                      ? `border-${type.color}-500 bg-${type.color}-50 shadow-md`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => setScanConfig({...scanConfig, scanType: type.id})}
                >
                  <div className="flex items-center mb-3">
                    <span className="text-3xl mr-3">{type.icon}</span>
                    <div>
                      <span className="font-semibold text-lg">{type.name}</span>
                      <div className="text-xs text-gray-500">Duration: {type.duration}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-800">What's included:</h4>
                    <ul className="space-y-1">
                      {type.features.map((feature, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2 mt-0.5">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Scan Type Summary */}
            {selectedScanType && (
              <div className={`mt-4 p-4 rounded-lg bg-${selectedScanType.color}-50 border border-${selectedScanType.color}-200`}>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{selectedScanType.icon}</span>
                  <span className="font-semibold text-gray-900">Selected: {selectedScanType.name}</span>
                </div>
                <p className="text-sm text-gray-700">
                  {selectedScanType.id === 'quick' 
                    ? 'Perfect for quick security checks and basic vulnerability assessment. Focuses on the most critical security issues.'
                    : 'Comprehensive security analysis following industry best practices. Includes detailed compliance checking and advanced threat detection.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Scan Button */}
          <div className="flex justify-center">
            <button
              onClick={startSecurityScan}
              disabled={isScanning || !scanConfig.targetUrl}
              className={`px-8 py-3 rounded-lg font-medium text-lg transition-colors ${
                isScanning || !scanConfig.targetUrl
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : scanConfig.scanType === 'quick'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isScanning ? `Running ${selectedScanType?.name}...` : `Start ${selectedScanType?.name}`}
            </button>
          </div>
        </div>
      </div>

      {/* Scanning Progress */}
      {isScanning && (
        <div className={`${scanConfig.scanType === 'quick' ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'} border rounded-xl p-8 mb-8`}>
          <div className="flex items-center mb-6">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${scanConfig.scanType === 'quick' ? 'border-blue-600' : 'border-red-600'} mr-4`}></div>
            <div>
              <h3 className={`text-xl font-semibold ${scanConfig.scanType === 'quick' ? 'text-blue-900' : 'text-red-900'}`}>
                {selectedScanType?.name} in Progress
              </h3>
              <p className={`${scanConfig.scanType === 'quick' ? 'text-blue-700' : 'text-red-700'}`}>
                Analyzing {scanConfig.targetUrl}
              </p>
            </div>
          </div>
          
          <div className={`space-y-3 ${scanConfig.scanType === 'quick' ? 'text-blue-700' : 'text-red-700'}`}>
            <div className="flex items-center">
              <div className={`w-2 h-2 ${scanConfig.scanType === 'quick' ? 'bg-blue-500' : 'bg-red-500'} rounded-full mr-3 animate-pulse`}></div>
              <span className="text-sm">🔍 Analyzing security headers...</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 ${scanConfig.scanType === 'quick' ? 'bg-blue-500' : 'bg-red-500'} rounded-full mr-3 animate-pulse`}></div>
              <span className="text-sm">🔒 Checking SSL/TLS configuration...</span>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 ${scanConfig.scanType === 'quick' ? 'bg-blue-500' : 'bg-red-500'} rounded-full mr-3 animate-pulse`}></div>
              <span className="text-sm">🛡️ Performing vulnerability tests...</span>
            </div>
            {scanConfig.scanType === 'full' && (
              <>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm">🎯 Running advanced security checks...</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm">📋 Performing compliance assessment...</span>
                </div>
              </>
            )}
            <div className="flex items-center">
              <div className={`w-2 h-2 ${scanConfig.scanType === 'quick' ? 'bg-blue-500' : 'bg-red-500'} rounded-full mr-3 animate-pulse`}></div>
              <span className="text-sm">📊 Generating security report...</span>
            </div>
          </div>
        </div>
      )}

      {/* Scan Results */}
      {scanResults && scanResults.success !== false && (
        <div className="space-y-8">
          {/* Results Header */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Security Scan Results</h3>
                <p className="text-gray-600">{scanConfig.targetUrl}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Scan Type: {selectedScanType?.name}</span>
                  <span>•</span>
                  <span>Depth: {safeGet(scanResults, 'securityHeaders.scanDepth', 'unknown')}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="px-4 py-2 rounded-full font-medium bg-green-100 text-green-800">
                  ✅ COMPLETED
                </div>
                <button
                  onClick={resetScan}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  New Scan
                </button>
              </div>
            </div>

            {/* Security Score Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className={`text-3xl font-bold ${getScoreColor(safeGet(scanResults, 'securityScore', 0))}`}>
                  {safeGet(scanResults, 'securityScore', 0)}%
                </div>
                <div className="text-sm text-gray-600 mt-2">Security Score</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(safeGet(scanResults, 'overallRisk', 'Unknown'))}`}>
                  {safeGet(scanResults, 'overallRisk', 'Unknown')}
                </div>
                <div className="text-sm text-gray-600 mt-2">Risk Level</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {safeGet(scanResults, 'securityHeaders.present', 0)}
                </div>
                <div className="text-sm text-gray-600 mt-2">Security Headers</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {safeGet(scanResults, 'scanDuration', 0)}ms
                </div>
                <div className="text-sm text-gray-600 mt-2">Scan Duration</div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Security Headers Analysis */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4">
                Security Headers Analysis 
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({safeGet(scanResults, 'securityHeaders.scanDepth', 'unknown')} scan)
                </span>
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Headers Score</span>
                  <span className={`font-bold ${getScoreColor(safeGet(scanResults, 'securityHeaders.score', 0))}`}>
                    {safeGet(scanResults, 'securityHeaders.score', 0)}%
                  </span>
                </div>
                
                {safeGet(scanResults, 'securityHeaders.headers') && (
                  <>
                    <div>
                      <h5 className="font-medium text-green-800 mb-2">✅ Present Headers:</h5>
                      <div className="space-y-1">
                        {Object.entries(safeGet(scanResults, 'securityHeaders.headers', {}))
                          .filter(([key, value]) => value !== null)
                          .map(([header, value], index) => (
                            <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                              {header}
                            </span>
                          ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-red-800 mb-2">❌ Missing Headers:</h5>
                      <div className="space-y-1">
                        {Object.entries(safeGet(scanResults, 'securityHeaders.headers', {}))
                          .filter(([key, value]) => value === null)
                          .map(([header, value], index) => (
                            <span key={index} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                              {header}
                            </span>
                          ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* SSL/TLS Analysis */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4">
                SSL/TLS Analysis
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({safeGet(scanResults, 'sslAnalysis.scanDepth', 'unknown')} scan)
                </span>
              </h4>
              <div className="space-y-3">
                {safeGet(scanResults, 'sslAnalysis.certificate.valid') ? (
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-green-600 mr-2">🔒</span>
                      <span className="font-medium">HTTPS Enabled</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      SSL Certificate Grade: {safeGet(scanResults, 'sslAnalysis.grade', 'A')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Score: {safeGet(scanResults, 'sslAnalysis.score', 95)}/100
                    </p>
                    {scanConfig.scanType === 'full' && safeGet(scanResults, 'sslAnalysis.cipherSuites') && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          Strong Cipher Suites: {safeGet(scanResults, 'sslAnalysis.cipherSuites.strong', 0)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Key Size: {safeGet(scanResults, 'sslAnalysis.keyExchange.keySize', 'Unknown')} bits
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-red-600 mr-2">⚠️</span>
                      <span className="font-medium">SSL/TLS Issues Detected</span>
                    </div>
                    <p className="text-sm text-red-600">Certificate or configuration problems found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Vulnerability Tests */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4">
                Vulnerability Tests
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({safeGet(scanResults, 'vulnerabilityChecks.summary.scanDepth', 'unknown')} scan)
                </span>
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-3">
                  <span>Tests Performed</span>
                  <span className="font-bold text-gray-900">
                    {safeGet(scanResults, 'vulnerabilityChecks.summary.totalTests', 0)}
                  </span>
                </div>
                
                {safeGet(scanResults, 'vulnerabilityChecks.checks') && 
                  Object.entries(safeGet(scanResults, 'vulnerabilityChecks.checks', {})).map(([test, result], index) => (
                    <div key={index} className="border border-gray-200 rounded p-3">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-sm">{test.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div className={`text-xs px-2 py-1 rounded ${result.vulnerable ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {result.vulnerable ? 'Vulnerable' : 'Secure'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{result.description}</div>
                      {scanConfig.scanType === 'full' && result.owaspCategory && (
                        <div className="text-xs text-blue-600 mt-1">{result.owaspCategory}</div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Overall Assessment */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4">Overall Assessment</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Vulnerability Score</span>
                  <span className={`font-bold ${getScoreColor(safeGet(scanResults, 'vulnerabilityChecks.summary.score', 0))}`}>
                    {safeGet(scanResults, 'vulnerabilityChecks.summary.score', 0)}%
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Vulnerabilities Found: {safeGet(scanResults, 'vulnerabilityChecks.summary.vulnerabilities', 0)}
                </div>
                
                {/* Full scan additional metrics */}
                {scanConfig.scanType === 'full' && safeGet(scanResults, 'complianceCheck') && (
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <h5 className="font-medium text-gray-800 mb-2">Compliance Assessment</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>OWASP Compliance:</span>
                        <span className={`font-medium ${getScoreColor(safeGet(scanResults, 'complianceCheck.owaspCompliance.score', 0))}`}>
                          {safeGet(scanResults, 'complianceCheck.owaspCompliance.score', 0)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Industry Standards:</span>
                        <span className={`font-medium ${getScoreColor(safeGet(scanResults, 'complianceCheck.industryStandards.score', 0))}`}>
                          {safeGet(scanResults, 'complianceCheck.industryStandards.score', 0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h4 className="text-lg font-semibold mb-6">Security Assessment Report</h4>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h5 className="font-medium mb-3 text-gray-900">Key Findings</h5>
                {safeGet(scanResults, 'findings', []).length > 0 ? (
                  <ul className="space-y-2">
                    {safeGet(scanResults, 'findings', []).map((finding, index) => (
                      <li key={index} className="text-sm bg-gray-50 p-3 rounded border-l-4 border-orange-400">
                        <div className="font-medium text-gray-800">{finding.category}</div>
                        <div className="text-gray-600">{finding.issue || finding}</div>
                        <div className={`text-xs mt-1 px-2 py-1 rounded inline-block ${
                          finding.severity === 'High' ? 'bg-red-100 text-red-800' :
                          finding.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {finding.severity || 'Info'}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-600 text-sm">✅ No critical security issues detected</p>
                )}
              </div>
              
              <div>
                <h5 className="font-medium mb-3 text-gray-900">Security Recommendations</h5>
                <ul className="space-y-2">
                  {safeGet(scanResults, 'recommendations', []).map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2 mt-0.5">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Scan type comparison suggestion */}
            {scanConfig.scanType === 'quick' && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600 mr-2">💡</span>
                  <span className="font-medium text-blue-900">Want More Details?</span>
                </div>
                <p className="text-sm text-blue-700">
                  This was a quick scan focusing on essential security basics. 
                  Run a <button 
                    onClick={() => setScanConfig({...scanConfig, scanType: 'full'})}
                    className="underline hover:no-underline font-medium"
                  >Full Security Audit</button> for comprehensive OWASP Top 10 analysis, 
                  advanced security checks, and detailed compliance assessment.
                </p>
              </div>
            )}
          </div>

          {/* Technical Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <details className="cursor-pointer">
              <summary className="text-lg font-semibold text-gray-900 hover:text-gray-700">
                🔧 Security Scan Technical Details
              </summary>
              <div className="mt-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Scan Configuration</h5>
                    <ul className="space-y-1">
                      <li>• Target: {scanConfig.targetUrl}</li>
                      <li>• Scan Type: {selectedScanType?.name}</li>
                      <li>• Depth: {safeGet(scanResults, 'securityHeaders.scanDepth', 'unknown')}</li>
                      <li>• Framework: Custom Security Scanner</li>
                      <li>• Runtime: Server-side Node.js</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Security Tests Performed</h5>
                    <ul className="space-y-1">
                      <li>• Security headers validation ({scanConfig.scanType === 'quick' ? '4 essential' : '9 comprehensive'})</li>
                      <li>• SSL/TLS configuration check</li>
                      <li>• Vulnerability pattern detection ({scanConfig.scanType === 'quick' ? 'Top 4' : 'OWASP Top 10+'})</li>
                      {scanConfig.scanType === 'full' && (
                        <>
                          <li>• Advanced security analysis</li>
                          <li>• Compliance assessment</li>
                        </>
                      )}
                      <li>• Risk assessment analysis</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-600">
                    Executed by: Yusuf Aslan - Security Testing Portfolio • 
                    Timestamp: {new Date(safeGet(scanResults, 'timestamp', Date.now())).toLocaleString()}
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Error Display */}
      {scanResults && scanResults.success === false && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <h4 className="text-lg font-semibold text-red-900 mb-4">Security Scan Failed</h4>
          <div className="text-red-700 mb-4">
            {scanResults.error}
          </div>
          
          {scanResults.troubleshooting && (
            <div>
              <h5 className="font-medium text-red-900 mb-2">Troubleshooting Tips:</h5>
              <ul className="text-red-700 text-sm space-y-1">
                {scanResults.troubleshooting.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Call to Action */}
      {!isScanning && !scanResults && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔐</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Ready to Scan for Security Issues?</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            Choose between a quick essential security check or comprehensive security audit
          </p>
          <div className="text-sm text-gray-500">
            Current selection: <span className="font-medium">{selectedScanType?.name}</span> 
            ({selectedScanType?.duration})
          </div>
        </div>
      )}
    </div>
  )
}