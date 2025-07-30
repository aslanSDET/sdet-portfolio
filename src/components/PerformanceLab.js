// src/components/PerformanceLab.js
// Create this file: src/components/PerformanceLab.js

'use client'
import { useState } from 'react'

const testTypes = [
  {
    id: 'load-test',
    name: 'Load Test',
    description: 'Simulates normal expected load to validate system performance under typical conditions',
    icon: '📈',
    color: 'blue',
    defaultVUs: 10,
    defaultDuration: 30
  },
  {
    id: 'stress-test',
    name: 'Stress Test',
    description: 'Pushes system beyond normal capacity to find breaking points and performance degradation',
    icon: '💪',
    color: 'orange',
    defaultVUs: 25,
    defaultDuration: 45
  },
  {
    id: 'spike-test',
    name: 'Spike Test',
    description: 'Tests system behavior under sudden traffic spikes and rapid load variations',
    icon: '⚡',
    color: 'red',
    defaultVUs: 15,
    defaultDuration: 60
  }
]

export default function PerformanceLab() {
  const [selectedTest, setSelectedTest] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [testConfig, setTestConfig] = useState({
    virtualUsers: 10,
    duration: 30,
    targetUrl: 'https://jsonplaceholder.typicode.com/posts/1'
  })

  const runPerformanceTest = async (testType) => {
    setIsRunning(true)
    setSelectedTest(testType)
    setTestResults(null)

    try {
      const response = await fetch('/api/run-performance-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType,
          ...testConfig
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const results = await response.json()
      setTestResults(results)

    } catch (error) {
      console.error('Performance test failed:', error)
      setTestResults({
        success: false,
        error: error.message,
        testType
      })
    } finally {
      setIsRunning(false)
    }
  }

  const formatDuration = (ms) => {
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getTestTypeDetails = (id) => {
    return testTypes.find(test => test.id === id)
  }

  const resetTest = () => {
    setTestResults(null)
    setSelectedTest(null)
    setIsRunning(false)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-light mb-6">k6 Performance Lab</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Interactive load testing with real-time metrics. Configure test parameters and watch 
          performance analysis unfold with detailed charts and professional reporting.
        </p>
        <p className="text-sm text-gray-500 mt-4 max-w-2xl mx-auto">
          📝 Note: This is a simulation demonstrating k6 testing methodology and reporting. 
          Real k6 tests would execute actual HTTP requests against your specified target URL.
        </p>
      </div>

      {/* Test Configuration */}
      {!testResults && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Test Configuration</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target URL</label>
              <input
                type="url"
                value={testConfig.targetUrl}
                onChange={(e) => setTestConfig({...testConfig, targetUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
                disabled={isRunning}
              />
              <div className="mt-2">
                <details className="text-xs text-gray-600">
                  <summary className="cursor-pointer hover:text-gray-800">Suggested URLs</summary>
                  <div className="mt-2 space-y-1">
                    <button 
                      type="button"
                      onClick={() => setTestConfig({...testConfig, targetUrl: 'https://jsonplaceholder.typicode.com/posts/1'})}
                      className="block text-blue-600 hover:text-blue-800"
                      disabled={isRunning}
                    >
                      https://jsonplaceholder.typicode.com/posts/1 (JSON API)
                    </button>
                    <button 
                      type="button"
                      onClick={() => setTestConfig({...testConfig, targetUrl: 'https://httpbin.org/get'})}
                      className="block text-blue-600 hover:text-blue-800"
                      disabled={isRunning}
                    >
                      https://httpbin.org/get (Simple GET)
                    </button>
                    <button 
                      type="button"
                      onClick={() => setTestConfig({...testConfig, targetUrl: 'https://postman-echo.com/get'})}
                      className="block text-blue-600 hover:text-blue-800"
                      disabled={isRunning}
                    >
                      https://postman-echo.com/get (Postman Echo)
                    </button>
                  </div>
                </details>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Virtual Users</label>
              <input
                type="number"
                value={testConfig.virtualUsers}
                onChange={(e) => setTestConfig({...testConfig, virtualUsers: parseInt(e.target.value) || 1})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="100"
                disabled={isRunning}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
              <input
                type="number"
                value={testConfig.duration}
                onChange={(e) => setTestConfig({...testConfig, duration: parseInt(e.target.value) || 1})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="5"
                max="300"
                disabled={isRunning}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setTestConfig({
                virtualUsers: 10,
                duration: 30,
                targetUrl: testConfig.targetUrl
              })}
              disabled={isRunning}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      )}

      {/* Test Type Selection */}
      {!testResults && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {testTypes.map((test) => (
            <div key={test.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{test.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{test.name}</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">{test.description}</p>
              
              <div className="text-xs text-gray-500 mb-4 space-y-1">
                <div>Recommended VUs: {test.defaultVUs}</div>
                <div>Recommended Duration: {test.defaultDuration}s</div>
                <div className="text-blue-600 mt-2">
                  💡 Your custom values will be preserved
                </div>
              </div>
              
              <button
                onClick={() => {
                  // Always preserve user's custom values, only use defaults if user hasn't changed them
                  const hasUserCustomized = testConfig.virtualUsers !== 10 || testConfig.duration !== 30
                  
                  if (!hasUserCustomized) {
                    // User is using initial defaults, so apply test-specific defaults
                    setTestConfig(prev => ({
                      ...prev,
                      virtualUsers: test.defaultVUs,
                      duration: test.defaultDuration
                    }))
                  }
                  
                  runPerformanceTest(test.id)
                }}
                disabled={isRunning}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isRunning 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : `bg-${test.color}-600 hover:bg-${test.color}-700 text-white`
                }`}
              >
                {isRunning && selectedTest === test.id ? 'Running Test...' : 
                  testConfig.virtualUsers === test.defaultVUs && testConfig.duration === test.defaultDuration 
                    ? `Launch ${test.name} (Defaults)` 
                    : `Launch ${test.name} (Custom)`
                }
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Test Execution Status */}
      {isRunning && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-4"></div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900">
                Executing: {getTestTypeDetails(selectedTest)?.name}
              </h3>
              <p className="text-blue-700">k6 performance test in progress...</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3 text-blue-700">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm">Initializing k6 test engine...</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm">Ramping up {testConfig.virtualUsers} virtual users...</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm">Collecting performance metrics...</span>
              </div>
            </div>
            
            <div className="bg-blue-100 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Test Configuration</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div>Target: {testConfig.targetUrl}</div>
                <div>Virtual Users: {testConfig.virtualUsers}</div>
                <div>Duration: {testConfig.duration}s</div>
                <div>Test Type: {getTestTypeDetails(selectedTest)?.name}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults && (
        <div className="space-y-8">
          {/* Results Header */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Performance Test Results</h3>
                <p className="text-gray-600">{getTestTypeDetails(testResults.testType)?.name} completed</p>
              </div>
              <div className="flex gap-3">
                <div className={`px-4 py-2 rounded-full font-medium ${
                  testResults.success 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {testResults.success ? '✅ COMPLETED' : '❌ FAILED'}
                </div>
                <button
                  onClick={resetTest}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Run New Test
                </button>
              </div>
            </div>

            {/* Test Summary Metrics */}
            {testResults.success && testResults.metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {testResults.metrics.summary.totalRequests}
                  </div>
                  <div className="text-sm text-gray-600">Total Requests</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {testResults.metrics.summary.averageResponseTime}ms
                  </div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {testResults.metrics.summary.averageRPS}
                  </div>
                  <div className="text-sm text-gray-600">Requests/Second</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {testResults.metrics.summary.averageErrorRate}%
                  </div>
                  <div className="text-sm text-gray-600">Error Rate</div>
                </div>
              </div>
            )}
          </div>

          {/* Performance Charts */}
          {testResults.success && testResults.metrics && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Response Time Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4">Response Time Over Time</h4>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <SimpleLineChart 
                    data={testResults.metrics.timeSeriesData}
                    dataKey="responseTime"
                    color="#3B82F6"
                    unit="ms"
                  />
                </div>
              </div>

              {/* Requests Per Second Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4">Requests Per Second</h4>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <SimpleLineChart 
                    data={testResults.metrics.timeSeriesData}
                    dataKey="rps"
                    color="#10B981"
                    unit="req/s"
                  />
                </div>
              </div>

              {/* Error Rate Chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4">Error Rate</h4>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <SimpleLineChart 
                    data={testResults.metrics.timeSeriesData}
                    dataKey="errorRate"
                    color="#EF4444"
                    unit="%"
                  />
                </div>
              </div>

              {/* Percentiles */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-4">Response Time Percentiles</h4>
                <div className="space-y-3">
                  {Object.entries(testResults.metrics.summary.percentiles).map(([percentile, value]) => (
                    <div key={percentile} className="flex justify-between items-center">
                      <span className="text-gray-600">{percentile.toUpperCase()}</span>
                      <span className="font-semibold">{value}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Performance Analysis */}
          {testResults.success && testResults.summary && (
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h4 className="text-lg font-semibold mb-4">Performance Analysis</h4>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h5 className="font-medium mb-3 text-gray-900">Overall Performance</h5>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    testResults.summary.overallPerformance === 'Good' ? 'bg-green-100 text-green-800' :
                    testResults.summary.overallPerformance === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {testResults.summary.overallPerformance}
                  </div>
                  
                  <h5 className="font-medium mb-3 mt-6 text-gray-900">Key Findings</h5>
                  <ul className="space-y-2">
                    {testResults.summary.keyFindings.map((finding, index) => (
                      <li key={index} className="text-gray-600 text-sm">• {finding}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium mb-3 text-gray-900">Recommendations</h5>
                  <ul className="space-y-2">
                    {testResults.summary.recommendations.map((rec, index) => (
                      <li key={index} className="text-gray-600 text-sm">• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* k6 Script Display */}
          {testResults.success && testResults.testScript && (
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <details className="cursor-pointer">
                <summary className="text-lg font-semibold text-gray-900 hover:text-gray-700">
                  🔧 Generated k6 Test Script
                </summary>
                <div className="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm"><code>{testResults.testScript}</code></pre>
                </div>
              </details>
            </div>
          )}

          {/* Error Display */}
          {!testResults.success && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <h4 className="text-lg font-semibold text-red-900 mb-4">Test Execution Failed</h4>
              <div className="text-red-700 bg-red-100 p-4 rounded font-mono text-sm mb-4">
                {testResults.error}
              </div>
              
              {testResults.troubleshooting && (
                <div>
                  <h5 className="font-medium text-red-900 mb-2">Troubleshooting Tips:</h5>
                  <ul className="text-red-700 text-sm space-y-1">
                    {testResults.troubleshooting.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Call to Action */}
      {!isRunning && !testResults && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Ready to Test Performance?</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Configure your test parameters above and select a test type to see k6 performance analysis in action
          </p>
        </div>
      )}
    </div>
  )
}

// Simple chart component for visualization
function SimpleLineChart({ data, dataKey, color, unit }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-500">No data available</div>
  }

  const maxValue = Math.max(...data.map(d => d[dataKey]))
  const minValue = Math.min(...data.map(d => d[dataKey]))
  const range = maxValue - minValue || 1

  return (
    <div className="w-full h-full relative">
      <svg className="w-full h-full" viewBox="0 0 400 200">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(y => (
          <line
            key={y}
            x1="40"
            y1={40 + y * 120}
            x2="380"
            y2={40 + y * 120}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}
        
        {/* Chart line */}
        <polyline
          points={data.map((d, i) => {
            const x = 40 + (i / (data.length - 1)) * 340
            const y = 160 - ((d[dataKey] - minValue) / range) * 120
            return `${x},${y}`
          }).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Y-axis labels */}
        <text x="35" y="45" textAnchor="end" className="text-xs fill-gray-500">
          {Math.round(maxValue)}{unit}
        </text>
        <text x="35" y="165" textAnchor="end" className="text-xs fill-gray-500">
          {Math.round(minValue)}{unit}
        </text>
      </svg>
    </div>
  )
}