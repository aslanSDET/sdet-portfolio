// src/components/APITestingPlayground.js
// Create this file: src/components/APITestingPlayground.js

'use client'
import { useState } from 'react'

const predefinedApis = [
  {
    name: 'JSONPlaceholder - Get Post',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: {},
    body: null,
    description: 'Fetch a sample blog post from JSONPlaceholder API'
  },
  {
    name: 'JSONPlaceholder - Create Post',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    headers: { 'Content-Type': 'application/json' },
    body: {
      title: 'Test Post',
      body: 'This is a test post created by the API Testing Playground',
      userId: 1
    },
    description: 'Create a new post via JSONPlaceholder API'
  },
  {
    name: 'HTTPBin - Headers Test',
    method: 'GET',
    url: 'https://httpbin.org/headers',
    headers: { 'X-Custom-Header': 'SDET-Portfolio-Test' },
    body: null,
    description: 'Test custom headers and see what the server receives'
  },
  {
    name: 'Postman Echo - POST Test',
    method: 'POST',
    url: 'https://postman-echo.com/post',
    headers: { 'Content-Type': 'application/json' },
    body: {
      message: 'Hello from API Testing Playground',
      timestamp: new Date().toISOString()
    },
    description: 'Test POST request with JSON payload'
  }
]

const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

export default function APITestingPlayground() {
  const [testConfig, setTestConfig] = useState({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: {},
    body: '',
    testName: 'API Test',
    timeout: 10000
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [headerInput, setHeaderInput] = useState('')
  const [activeTab, setActiveTab] = useState('request')

  const executeApiTest = async () => {
    setIsRunning(true)
    setTestResults(null)

    try {
      const requestBody = testConfig.body.trim() ? JSON.parse(testConfig.body) : null
      
      const response = await fetch('/api/test-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: testConfig.method,
          url: testConfig.url,
          headers: testConfig.headers,
          body: requestBody,
          testName: testConfig.testName,
          timeout: testConfig.timeout
        })
      })

      const results = await response.json()
      setTestResults(results)
      setActiveTab('response')

    } catch (error) {
      console.error('API test failed:', error)
      setTestResults({
        success: false,
        error: error.message,
        errorType: 'Client Error'
      })
    } finally {
      setIsRunning(false)
    }
  }

  const loadPredefinedApi = (api) => {
    setTestConfig({
      ...testConfig,
      method: api.method,
      url: api.url,
      headers: api.headers,
      body: api.body ? JSON.stringify(api.body, null, 2) : '',
      testName: api.name
    })
    setTestResults(null)
  }

  const addHeader = () => {
    if (headerInput.includes(':')) {
      const [key, ...valueParts] = headerInput.split(':')
      const value = valueParts.join(':').trim()
      setTestConfig({
        ...testConfig,
        headers: { ...testConfig.headers, [key.trim()]: value }
      })
      setHeaderInput('')
    }
  }

  const removeHeader = (key) => {
    const newHeaders = { ...testConfig.headers }
    delete newHeaders[key]
    setTestConfig({ ...testConfig, headers: newHeaders })
  }

  const resetTest = () => {
    setTestResults(null)
    setActiveTab('request')
  }

  const formatJson = (jsonString) => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2)
    } catch {
      return jsonString
    }
  }

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-600'
    if (status >= 300 && status < 400) return 'text-yellow-600'
    if (status >= 400 && status < 500) return 'text-orange-600'
    if (status >= 500) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-light mb-6">API Testing Playground</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Interactive REST API testing with real-time validation, response analysis, and professional reporting. 
          Test any public API endpoint or use our predefined examples.
        </p>
      </div>

      {/* Predefined API Examples */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Quick Start Examples</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {predefinedApis.map((api, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{api.name}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  api.method === 'GET' ? 'bg-green-100 text-green-800' :
                  api.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                  api.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {api.method}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{api.description}</p>
              <button
                onClick={() => loadPredefinedApi(api)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                disabled={isRunning}
              >
                Load Example →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
        <h3 className="text-xl font-semibold mb-6">Test Configuration</h3>
        
        <div className="space-y-6">
          {/* Method and URL */}
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
              <select
                value={testConfig.method}
                onChange={(e) => setTestConfig({...testConfig, method: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isRunning}
              >
                {httpMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input
                type="url"
                value={testConfig.url}
                onChange={(e) => setTestConfig({...testConfig, url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.example.com/endpoint"
                disabled={isRunning}
              />
            </div>
          </div>

          {/* Test Name and Timeout */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
              <input
                type="text"
                value={testConfig.testName}
                onChange={(e) => setTestConfig({...testConfig, testName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isRunning}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timeout (ms)</label>
              <input
                type="number"
                value={testConfig.timeout}
                onChange={(e) => setTestConfig({...testConfig, timeout: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1000"
                max="30000"
                disabled={isRunning}
              />
            </div>
          </div>

          {/* Headers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Headers</label>
            <div className="space-y-2">
              {Object.entries(testConfig.headers).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm">{key}:</span>
                  <span className="font-mono text-sm flex-1">{value}</span>
                  <button
                    onClick={() => removeHeader(key)}
                    className="text-red-600 hover:text-red-800 text-sm"
                    disabled={isRunning}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={headerInput}
                  onChange={(e) => setHeaderInput(e.target.value)}
                  placeholder="Header-Name: header value"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isRunning}
                  onKeyPress={(e) => e.key === 'Enter' && addHeader()}
                />
                <button
                  onClick={addHeader}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300"
                  disabled={isRunning || !headerInput.includes(':')}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Request Body */}
          {['POST', 'PUT', 'PATCH'].includes(testConfig.method) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Request Body (JSON)</label>
              <textarea
                value={testConfig.body}
                onChange={(e) => setTestConfig({...testConfig, body: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                rows="8"
                placeholder='{"key": "value"}'
                disabled={isRunning}
              />
              <button
                onClick={() => setTestConfig({...testConfig, body: formatJson(testConfig.body)})}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                disabled={isRunning}
              >
                Format JSON
              </button>
            </div>
          )}

          {/* Execute Button */}
          <div className="flex justify-center">
            <button
              onClick={executeApiTest}
              disabled={isRunning || !testConfig.url}
              className={`px-8 py-3 rounded-lg font-medium text-lg transition-colors ${
                isRunning || !testConfig.url
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isRunning ? 'Testing API...' : 'Execute API Test'}
            </button>
          </div>
        </div>
      </div>

      {/* Test Execution Status */}
      {isRunning && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
          <div className="flex items-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <h3 className="text-lg font-semibold text-blue-900">
              Executing API Test: {testConfig.testName}
            </h3>
          </div>
          <div className="text-blue-700 space-y-2">
            <div>🌐 Sending {testConfig.method} request to {testConfig.url}</div>
            <div>⏱️ Measuring response time and analyzing results</div>
            <div>🔍 Validating response data and security headers</div>
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
                <h3 className="text-2xl font-semibold text-gray-900">API Test Results</h3>
                <p className="text-gray-600">{testResults.testName || 'API Test'}</p>
              </div>
              <div className="flex gap-3">
                <div className={`px-4 py-2 rounded-full font-medium ${
                  testResults.success 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {testResults.success ? '✅ SUCCESS' : '❌ FAILED'}
                </div>
                <button
                  onClick={resetTest}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  New Test
                </button>
              </div>
            </div>

            {/* Success Metrics */}
            {testResults.success && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getStatusColor(testResults.response.status)}`}>
                    {testResults.response.status}
                  </div>
                  <div className="text-sm text-gray-600">Status Code</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {testResults.performance.responseTime}ms
                  </div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(testResults.response.size / 1024 * 10) / 10}KB
                  </div>
                  <div className="text-sm text-gray-600">Response Size</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {testResults.analysis?.securityAnalysis?.score || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Security Score</div>
                </div>
              </div>
            )}
          </div>

          {/* Tabbed Results View */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Tab Headers */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex">
                {['request', 'response', 'analysis'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {/* Request Tab */}
              {activeTab === 'request' && testResults.success && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Request Details</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div><strong>Method:</strong> {testResults.request.method}</div>
                      <div><strong>URL:</strong> {testResults.request.url}</div>
                    </div>
                  </div>
                  
                  {Object.keys(testResults.request.headers).length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Request Headers</h4>
                      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <pre>{JSON.stringify(testResults.request.headers, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                  
                  {testResults.request.body && (
                    <div>
                      <h4 className="font-semibold mb-3">Request Body</h4>
                      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <pre>{testResults.request.body}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Response Tab */}
              {activeTab === 'response' && testResults.success && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Response Status</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Response Headers</h4>
                    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre>{JSON.stringify(testResults.response.headers, null, 2)}</pre>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Response Data</h4>
                    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-96">
                      <pre>{JSON.stringify(testResults.response.data, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Tab */}
              {activeTab === 'analysis' && testResults.success && testResults.analysis && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Status Analysis */}
                    <div>
                      <h4 className="font-semibold mb-3">Status Analysis</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                          testResults.analysis.statusAnalysis.color === 'green' ? 'bg-green-100 text-green-800' :
                          testResults.analysis.statusAnalysis.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          testResults.analysis.statusAnalysis.color === 'red' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {testResults.analysis.statusAnalysis.category}
                        </div>
                        <p className="text-sm text-gray-600">{testResults.analysis.statusAnalysis.description}</p>
                      </div>
                    </div>

                    {/* Performance Analysis */}
                    <div>
                      <h4 className="font-semibold mb-3">Performance Analysis</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                          testResults.analysis.performanceAnalysis.color === 'green' ? 'bg-green-100 text-green-800' :
                          testResults.analysis.performanceAnalysis.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          testResults.analysis.performanceAnalysis.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                          testResults.analysis.performanceAnalysis.color === 'red' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {testResults.analysis.performanceAnalysis.rating}
                        </div>
                        <p className="text-sm text-gray-600">{testResults.analysis.performanceAnalysis.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Security Analysis */}
                  <div>
                    <h4 className="font-semibold mb-3">Security Headers Analysis</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="mb-4">
                        <span className="text-lg font-bold">Security Score: {testResults.analysis.securityAnalysis.score}%</span>
                      </div>
                      
                      {testResults.analysis.securityAnalysis.presentHeaders.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-medium text-green-800 mb-2">✅ Present Security Headers:</h5>
                          <div className="space-y-1">
                            {testResults.analysis.securityAnalysis.presentHeaders.map((header, index) => (
                              <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                                {header}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {testResults.analysis.securityAnalysis.missingHeaders.length > 0 && (
                        <div>
                          <h5 className="font-medium text-red-800 mb-2">❌ Missing Security Headers:</h5>
                          <div className="space-y-1">
                            {testResults.analysis.securityAnalysis.missingHeaders.map((header, index) => (
                              <span key={index} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                                {header}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Data Validation */}
                  <div>
                    <h4 className="font-semibold mb-3">Data Validation</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Data Type:</span> {testResults.analysis.dataValidation.dataType}
                        </div>
                        <div>
                          <span className="font-medium">Structure:</span> {testResults.analysis.dataValidation.structure}
                        </div>
                        <div>
                          <span className="font-medium">Valid:</span> 
                          <span className={testResults.analysis.dataValidation.isValid ? 'text-green-600' : 'text-red-600'}>
                            {testResults.analysis.dataValidation.isValid ? ' ✅ Yes' : ' ❌ No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-3">Recommendations</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ul className="space-y-2">
                        {testResults.analysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {!testResults.success && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-red-900">Test Failed</h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-red-800 font-medium mb-2">
                        Error Type: {testResults.errorType}
                      </div>
                      <div className="text-red-700 mb-4">
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
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <details className="cursor-pointer">
              <summary className="text-lg font-semibold text-gray-900 hover:text-gray-700">
                🔧 Technical Details
              </summary>
              <div className="mt-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Test Environment</h5>
                    <ul className="space-y-1">
                      <li>• Framework: Custom API Testing Engine</li>
                      <li>• Runtime: Server-side Node.js</li>
                      <li>• Validation: Response analysis with security checks</li>
                      <li>• Timeout: {testConfig.timeout}ms</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Features Demonstrated</h5>
                    <ul className="space-y-1">
                      <li>• HTTP method support (GET, POST, PUT, DELETE)</li>
                      <li>• Custom header configuration</li>
                      <li>• JSON request/response handling</li>
                      <li>• Performance and security analysis</li>
                      <li>• Error handling and troubleshooting</li>
                    </ul>
                  </div>
                </div>
                
                {testResults.success && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-sm text-gray-600">
                      Executed by: {testResults.executedBy} • 
                      Timestamp: {new Date(testResults.performance.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {!isRunning && !testResults && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔌</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Ready to Test APIs?</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Choose a predefined example above or configure your own API test to see comprehensive analysis in action
          </p>
        </div>
      )}
    </div>
  )
}