// src/app/api/test-api/route.js
// Create this file: src/app/api/test-api/route.js

export async function POST(request) {
    try {
      const { 
        method, 
        url, 
        headers = {}, 
        body, 
        timeout = 10000,
        testName = 'API Test'
      } = await request.json()
  
      // Validate inputs
      if (!method || !url) {
        throw new Error('Missing required parameters: method and url')
      }
  
      // Validate URL format
      try {
        new URL(url)
      } catch (urlError) {
        throw new Error('Invalid URL format')
      }
  
      console.log(`Starting API test: ${method} ${url}`)
      
      const startTime = Date.now()
      
      // Prepare request options
      const requestOptions = {
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SDET-Portfolio-API-Tester/1.0',
          ...headers
        }
      }
  
      // Add body for methods that support it
      if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
        requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
      }
  
      // Execute the API request
      const response = await fetch(url, {
        ...requestOptions,
        signal: AbortSignal.timeout(timeout)
      })
  
      const endTime = Date.now()
      const responseTime = endTime - startTime
  
      // Get response data
      const responseText = await response.text()
      let responseData
      let contentType = response.headers.get('content-type') || ''
  
      try {
        if (contentType.includes('application/json')) {
          responseData = JSON.parse(responseText)
        } else {
          responseData = responseText
        }
      } catch (parseError) {
        responseData = responseText
      }
  
      // Analyze response
      const analysis = analyzeResponse(response, responseData, responseTime)
  
      return Response.json({
        success: true,
        testName,
        request: {
          method: method.toUpperCase(),
          url,
          headers: requestOptions.headers,
          body: requestOptions.body || null
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          data: responseData,
          contentType,
          size: new Blob([responseText]).size
        },
        performance: {
          responseTime,
          timestamp: new Date().toISOString()
        },
        analysis,
        message: 'API test completed successfully',
        executedBy: 'Yusuf Aslan - API Testing Portfolio'
      })
  
    } catch (error) {
      const endTime = Date.now()
      console.error('API test error:', error)
      
      return Response.json({
        success: false,
        error: error.message,
        errorType: getErrorType(error),
        troubleshooting: getTroubleshootingTips(error),
        performance: {
          responseTime: null,
          timestamp: new Date().toISOString()
        },
        message: 'API test execution failed'
      }, { status: 500 })
    }
  }
  
  function analyzeResponse(response, data, responseTime) {
    const analysis = {
      statusAnalysis: getStatusAnalysis(response.status),
      performanceAnalysis: getPerformanceAnalysis(responseTime),
      securityAnalysis: getSecurityAnalysis(response),
      dataValidation: getDataValidation(data, response.headers.get('content-type')),
      recommendations: []
    }
  
    // Generate recommendations
    if (responseTime > 2000) {
      analysis.recommendations.push('Response time is high (>2s) - consider optimizing API performance')
    }
    
    if (response.status >= 400) {
      analysis.recommendations.push('Request failed - verify endpoint URL, method, and required parameters')
    }
    
    if (!response.headers.get('content-security-policy')) {
      analysis.recommendations.push('Consider implementing Content Security Policy headers')
    }
    
    if (analysis.recommendations.length === 0) {
      analysis.recommendations.push('API response looks healthy - good performance and status')
    }
  
    return analysis
  }
  
  function getStatusAnalysis(status) {
    if (status >= 200 && status < 300) {
      return { category: 'Success', description: 'Request completed successfully', color: 'green' }
    } else if (status >= 300 && status < 400) {
      return { category: 'Redirect', description: 'Request redirected', color: 'yellow' }
    } else if (status >= 400 && status < 500) {
      return { category: 'Client Error', description: 'Client-side error occurred', color: 'red' }
    } else if (status >= 500) {
      return { category: 'Server Error', description: 'Server-side error occurred', color: 'red' }
    } else {
      return { category: 'Unknown', description: 'Unexpected status code', color: 'gray' }
    }
  }
  
  function getPerformanceAnalysis(responseTime) {
    if (responseTime < 200) {
      return { rating: 'Excellent', description: 'Very fast response time', color: 'green' }
    } else if (responseTime < 500) {
      return { rating: 'Good', description: 'Acceptable response time', color: 'green' }
    } else if (responseTime < 1000) {
      return { rating: 'Fair', description: 'Slow response time', color: 'yellow' }
    } else if (responseTime < 2000) {
      return { rating: 'Poor', description: 'Very slow response time', color: 'orange' }
    } else {
      return { rating: 'Critical', description: 'Extremely slow response time', color: 'red' }
    }
  }
  
  function getSecurityAnalysis(response) {
    const securityHeaders = {
      'content-security-policy': 'CSP',
      'x-frame-options': 'X-Frame-Options',
      'x-content-type-options': 'X-Content-Type-Options',
      'strict-transport-security': 'HSTS',
      'x-xss-protection': 'XSS Protection'
    }
  
    const presentHeaders = []
    const missingHeaders = []
  
    Object.entries(securityHeaders).forEach(([header, name]) => {
      if (response.headers.get(header)) {
        presentHeaders.push(name)
      } else {
        missingHeaders.push(name)
      }
    })
  
    return {
      presentHeaders,
      missingHeaders,
      score: Math.round((presentHeaders.length / Object.keys(securityHeaders).length) * 100)
    }
  }
  
  function getDataValidation(data, contentType) {
    const validation = {
      isValid: true,
      dataType: 'unknown',
      structure: 'unknown',
      size: 0
    }
  
    try {
      if (contentType && contentType.includes('application/json')) {
        validation.dataType = 'JSON'
        validation.isValid = typeof data === 'object'
        validation.structure = Array.isArray(data) ? 'array' : 'object'
      } else if (contentType && contentType.includes('text/')) {
        validation.dataType = 'Text'
        validation.structure = 'string'
      } else {
        validation.dataType = 'Binary/Other'
      }
      
      validation.size = new Blob([JSON.stringify(data)]).size
    } catch (error) {
      validation.isValid = false
    }
  
    return validation
  }
  
  function getErrorType(error) {
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return 'Timeout'
    } else if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
      return 'Network Error'
    } else if (error.message.includes('Invalid URL')) {
      return 'Invalid URL'
    } else {
      return 'Unknown Error'
    }
  }
  
  function getTroubleshootingTips(error) {
    const tips = []
    
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      tips.push('Request timed out - try increasing timeout or check if the API is responsive')
      tips.push('Verify the target server is accessible and not overloaded')
    } else if (error.message.includes('Failed to fetch')) {
      tips.push('Network connectivity issue - check your internet connection')
      tips.push('Verify the API endpoint URL is correct and accessible')
      tips.push('Check if CORS is properly configured on the target API')
    } else if (error.message.includes('Invalid URL')) {
      tips.push('Ensure the URL includes the protocol (http:// or https://)')
      tips.push('Verify the URL format is correct and properly encoded')
    } else {
      tips.push('Check the API documentation for correct usage')
      tips.push('Verify authentication credentials if required')
      tips.push('Ensure request method and parameters are correct')
    }
    
    return tips
  }