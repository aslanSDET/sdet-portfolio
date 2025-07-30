// src/components/LiveTestRunner.js
// Create this file: src/components/LiveTestRunner.js

'use client'
import { useState } from 'react'

const testScenarios = [
  {
    id: 'login-demo',
    name: 'Login Form Validation',
    description: 'Tests form interactions, element validation, and user input handling',
    icon: '🔐',
    estimatedTime: '8-12 seconds'
  },
  {
    id: 'search-demo', 
    name: 'Search Functionality',
    description: 'Validates search input, result rendering, and page navigation',
    icon: '🔍',
    estimatedTime: '10-15 seconds'
  },
  {
    id: 'form-demo',
    name: 'Form Submission Test',
    description: 'Tests various form elements, validation, and data handling',
    icon: '📝',
    estimatedTime: '6-10 seconds'
  }
]

export default function LiveTestRunner() {
  const [isRunning, setIsRunning] = useState(false)
  const [activeTest, setActiveTest] = useState(null)
  const [testResults, setTestResults] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)

  const runTest = async (testType) => {
    setIsRunning(true)
    setActiveTest(testType)
    setTestResults(null)
    setCurrentStep(0)

    try {
      const response = await fetch('/api/run-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testType })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const results = await response.json()
      setTestResults(results)
      
      // Animate through steps
      if (results.steps && results.steps.length > 0) {
        for (let i = 0; i <= results.steps.length; i++) {
          setTimeout(() => setCurrentStep(i), i * 500)
        }
      }

    } catch (error) {
      console.error('Test execution failed:', error)
      setTestResults({
        success: false,
        error: error.message,
        steps: [],
        duration: 0
      })
    } finally {
      setIsRunning(false)
      setActiveTest(null)
    }
  }

  const formatDuration = (ms) => {
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getTestScenario = (id) => {
    return testScenarios.find(scenario => scenario.id === id)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-light mb-6">Live Playwright Testing</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Watch real Playwright tests execute in your browser. Click any scenario below to see 
          actual test automation running with live results, screenshots, and detailed step logs.
        </p>
      </div>

      {/* Test Scenario Selection */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {testScenarios.map((scenario) => (
          <div key={scenario.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">{scenario.icon}</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{scenario.name}</h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{scenario.description}</p>
            <div className="text-xs text-gray-500 mb-4">
              Estimated runtime: {scenario.estimatedTime}
            </div>
            <button
              onClick={() => runTest(scenario.id)}
              disabled={isRunning}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isRunning 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isRunning && activeTest === scenario.id ? 'Running Test...' : 'Run Live Test'}
            </button>
          </div>
        ))}
      </div>

      {/* Test Execution Status */}
      {isRunning && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <h3 className="text-lg font-semibold text-blue-900">
              Executing: {getTestScenario(activeTest)?.name}
            </h3>
          </div>
          <div className="text-blue-700">
            <div className="text-sm">🎭 Launching Playwright browser instance...</div>
            <div className="text-sm">🌐 Navigating to test target...</div>
            <div className="text-sm">⚡ Running automated test scenarios...</div>
          </div>
          <div className="mt-4 bg-blue-100 rounded-lg p-3">
            <div className="text-sm text-blue-800 font-medium">
              Real-time execution in progress - This is a live demonstration of Playwright automation
            </div>
          </div>
        </div>
      )}

      {/* Test Results Display */}
      {testResults && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Test Results</h3>
            <div className={`px-4 py-2 rounded-full font-medium ${
              testResults.success 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {testResults.success ? '✅ PASSED' : '❌ FAILED'}
            </div>
          </div>

          {/* Test Metadata */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm text-gray-600">Test Type</div>
              <div className="font-semibold">{getTestScenario(testResults.testType)?.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Execution Time</div>
              <div className="font-semibold">{formatDuration(testResults.duration)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Steps Completed</div>
              <div className="font-semibold">{testResults.steps?.length || 0}</div>
            </div>
          </div>

          {/* Step-by-Step Execution Log */}
          {testResults.steps && testResults.steps.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Execution Steps</h4>
              <div className="space-y-3">
                {testResults.steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`border-l-4 pl-4 py-2 transition-all duration-500 ${
                      index < currentStep 
                        ? 'border-green-400 bg-green-50' 
                        : index === currentStep
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium text-gray-500 mr-2">
                        Step {step.step || index + 1}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {step.action}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {step.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Screenshot Display */}
          {testResults.screenshot && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Final Screenshot</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={testResults.screenshot} 
                  alt="Test execution screenshot"
                  className="w-full h-auto max-h-96 object-contain bg-gray-50"
                />
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Screenshot captured at test completion - {new Date(testResults.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}

          {/* Error Display */}
          {testResults.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="text-lg font-semibold text-red-900 mb-2">Test Error</h4>
              <div className="text-sm text-red-700 font-mono bg-red-100 p-3 rounded">
                {testResults.error}
              </div>
            </div>
          )}

          {/* Technical Details */}
          <div className="border-t border-gray-200 pt-6">
            <details className="cursor-pointer">
              <summary className="text-sm font-medium text-gray-600 hover:text-gray-900">
                🔧 Technical Details
              </summary>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <div>• Browser: Chromium (Playwright)</div>
                <div>• Viewport: 1280x720</div>
                <div>• Execution Environment: Server-side Node.js</div>
                <div>• Test Framework: Custom Playwright implementation</div>
                <div>• Executed by: {testResults.executedBy}</div>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {!isRunning && !testResults && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎭</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Ready to See Automation in Action?</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Select any test scenario above to watch real Playwright automation execute live in your browser
          </p>
        </div>
      )}
    </div>
  )
}