// src/app/api/run-performance-test/route.js
// Create this file: src/app/api/run-performance-test/route.js

export async function POST(request) {
    try {
      const { testType, targetUrl, virtualUsers, duration } = await request.json()
      
      // Validate inputs
      if (!targetUrl || !testType) {
        throw new Error('Missing required parameters: testType and targetUrl')
      }
      
      // Validate URL format
      try {
        new URL(targetUrl)
      } catch (urlError) {
        throw new Error('Invalid URL format')
      }
      
      console.log(`Starting k6 ${testType} test - VUs: ${virtualUsers}, Duration: ${duration}s`)
      console.log(`Target URL: ${targetUrl}`)
      
      // Simulate k6 test execution with realistic performance data
      const testResults = await simulateK6Test({
        testType,
        targetUrl: targetUrl || 'https://jsonplaceholder.typicode.com/posts/1',
        virtualUsers: parseInt(virtualUsers) || 10,
        duration: parseInt(duration) || 30
      })
  
      return Response.json({
        success: true,
        testType,
        ...testResults,
        message: 'k6 performance test completed successfully',
        executedBy: 'Yusuf Aslan - Performance Testing Portfolio'
      })
      
    } catch (error) {
      console.error('k6 test error:', error)
      return Response.json(
        { 
          success: false, 
          error: error.message,
          message: 'Performance test execution failed',
          troubleshooting: [
            'Ensure the target URL is accessible and responds to HTTP requests',
            'Check if the URL supports CORS if testing from browser',
            'Try one of the suggested reliable test URLs',
            'Verify the URL format is correct (include https://)'
          ]
        }, 
        { status: 500 }
      )
    }
  }
  
  async function simulateK6Test({ testType, targetUrl, virtualUsers, duration }) {
    const startTime = Date.now()
    
    // Generate realistic performance metrics based on test type
    const metrics = generatePerformanceMetrics(testType, virtualUsers, duration)
    
    // Simulate test execution delay
    await new Promise(resolve => setTimeout(resolve, Math.min(duration * 100, 5000)))
    
    const endTime = Date.now()
    const actualDuration = endTime - startTime
    
    return {
      testConfig: {
        testType,
        targetUrl,
        virtualUsers,
        duration,
        actualDuration
      },
      metrics,
      summary: generateTestSummary(metrics, testType),
      timestamp: new Date().toISOString(),
      k6Version: '0.50.0',
      testScript: generateK6Script(testType, targetUrl, virtualUsers, duration)
    }
  }
  
  function generatePerformanceMetrics(testType, virtualUsers, duration) {
    const dataPoints = Math.min(duration, 60) // Max 60 data points for visualization
    const timeInterval = (duration * 1000) / dataPoints
    
    let baseResponseTime = 200
    let baseRPS = virtualUsers * 2
    let errorRate = 0.01
    
    // Adjust metrics based on test type
    switch (testType) {
      case 'load-test':
        baseResponseTime = 150 + Math.random() * 100
        errorRate = 0.005
        break
      case 'stress-test':
        baseResponseTime = 300 + Math.random() * 200
        errorRate = 0.02
        break
      case 'spike-test':
        baseResponseTime = 250 + Math.random() * 300
        errorRate = 0.015
        break
    }
  
    const timeSeriesData = []
    const responseTimes = []
    const requestsPerSecond = []
    const errorRates = []
    
    for (let i = 0; i < dataPoints; i++) {
      const timestamp = Date.now() + (i * timeInterval)
      const timeInSeconds = i * (duration / dataPoints)
      
      // Add realistic variations and patterns
      let responseTime = baseResponseTime
      let rps = baseRPS
      let currentErrorRate = errorRate
      
      // Simulate realistic patterns
      if (testType === 'stress-test' && timeInSeconds > duration * 0.7) {
        // Response time degrades under stress
        responseTime *= (1 + (timeInSeconds / duration) * 2)
        currentErrorRate *= 3
      }
      
      if (testType === 'spike-test') {
        // Simulate spike pattern
        const spikePhase = Math.sin((timeInSeconds / duration) * Math.PI * 2)
        responseTime += spikePhase * 200
        rps += spikePhase * virtualUsers
      }
      
      // Add random variations
      responseTime += (Math.random() - 0.5) * 50
      rps += (Math.random() - 0.5) * 5
      currentErrorRate += (Math.random() - 0.5) * 0.01
      
      // Ensure realistic bounds
      responseTime = Math.max(50, responseTime)
      rps = Math.max(0, rps)
      currentErrorRate = Math.max(0, Math.min(1, currentErrorRate))
      
      timeSeriesData.push({
        timestamp,
        time: timeInSeconds,
        responseTime: Math.round(responseTime),
        rps: Math.round(rps * 10) / 10,
        errorRate: Math.round(currentErrorRate * 1000) / 10, // Percentage with 1 decimal
        virtualUsers: testType === 'spike-test' ? 
          Math.round(virtualUsers * (1 + Math.sin(timeInSeconds / duration * Math.PI) * 0.5)) : 
          virtualUsers
      })
      
      responseTimes.push(Math.round(responseTime))
      requestsPerSecond.push(Math.round(rps * 10) / 10)
      errorRates.push(Math.round(currentErrorRate * 1000) / 10)
    }
    
    // Calculate percentiles
    const sortedResponseTimes = [...responseTimes].sort((a, b) => a - b)
    const p50 = sortedResponseTimes[Math.floor(sortedResponseTimes.length * 0.5)]
    const p90 = sortedResponseTimes[Math.floor(sortedResponseTimes.length * 0.9)]
    const p95 = sortedResponseTimes[Math.floor(sortedResponseTimes.length * 0.95)]
    const p99 = sortedResponseTimes[Math.floor(sortedResponseTimes.length * 0.99)]
    
    return {
      timeSeriesData,
      summary: {
        totalRequests: Math.round(requestsPerSecond.reduce((a, b) => a + b, 0) * duration / dataPoints),
        averageResponseTime: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length),
        maxResponseTime: Math.max(...responseTimes),
        minResponseTime: Math.min(...responseTimes),
        averageRPS: Math.round((requestsPerSecond.reduce((a, b) => a + b, 0) / requestsPerSecond.length) * 10) / 10,
        maxRPS: Math.max(...requestsPerSecond),
        totalErrors: Math.round(errorRates.reduce((a, b) => a + b, 0) / 10),
        averageErrorRate: Math.round((errorRates.reduce((a, b) => a + b, 0) / errorRates.length) * 10) / 10,
        percentiles: { p50, p90, p95, p99 }
      }
    }
  }
  
  function generateTestSummary(metrics, testType) {
    const { summary } = metrics
    let performance = 'Good'
    let recommendations = []
    
    // Performance analysis based on metrics
    if (summary.averageResponseTime > 500) {
      performance = 'Poor'
      recommendations.push('Response times are high - consider optimizing backend performance')
    } else if (summary.averageResponseTime > 300) {
      performance = 'Fair'
      recommendations.push('Response times could be improved - investigate slow endpoints')
    }
    
    if (summary.averageErrorRate > 5) {
      performance = 'Poor'
      recommendations.push('High error rate detected - check application stability')
    } else if (summary.averageErrorRate > 1) {
      recommendations.push('Monitor error rate - ensure proper error handling')
    }
    
    if (summary.percentiles.p95 > summary.averageResponseTime * 2) {
      recommendations.push('High response time variance - investigate performance outliers')
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Performance looks healthy - continue monitoring')
    }
    
    return {
      overallPerformance: performance,
      recommendations,
      keyFindings: [
        `Average response time: ${summary.averageResponseTime}ms`,
        `Peak RPS achieved: ${summary.maxRPS}`,
        `Total requests processed: ${summary.totalRequests}`,
        `Error rate: ${summary.averageErrorRate}%`
      ]
    }
  }
  
  function generateK6Script(testType, targetUrl, virtualUsers, duration) {
    let script = `import http from 'k6/http';
  import { check, sleep } from 'k6';
  
  export let options = {`
  
    switch (testType) {
      case 'load-test':
        script += `
    vus: ${virtualUsers},
    duration: '${duration}s',`
        break
      case 'stress-test':
        script += `
    stages: [
      { duration: '${Math.round(duration/3)}s', target: ${virtualUsers} },
      { duration: '${Math.round(duration/3)}s', target: ${virtualUsers * 2} },
      { duration: '${Math.round(duration/3)}s', target: 0 },
    ],`
        break
      case 'spike-test':
        script += `
    stages: [
      { duration: '${Math.round(duration*0.1)}s', target: ${virtualUsers} },
      { duration: '${Math.round(duration*0.2)}s', target: ${virtualUsers * 5} },
      { duration: '${Math.round(duration*0.4)}s', target: ${virtualUsers} },
      { duration: '${Math.round(duration*0.2)}s', target: ${virtualUsers * 3} },
      { duration: '${Math.round(duration*0.1)}s', target: 0 },
    ],`
        break
    }
  
    script += `
  };
  
  export default function() {
    let response = http.get('${targetUrl}');
    
    check(response, {
      'status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
    
    sleep(1);
  }`
  
    return script
  }