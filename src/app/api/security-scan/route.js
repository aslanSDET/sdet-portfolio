// src/app/api/security-scan/route.js
// Updated version with differentiated scan types

export async function POST(request) {
    try {
      const { 
        targetUrl, 
        scanType = 'full'
      } = await request.json()
  
      // Validate inputs
      if (!targetUrl) {
        throw new Error('Target URL is required')
      }
  
      // Validate URL format
      let parsedUrl
      try {
        parsedUrl = new URL(targetUrl)
      } catch (urlError) {
        throw new Error('Invalid URL format')
      }
  
      console.log(`Starting ${scanType} security scan for: ${targetUrl}`)
      
      const startTime = Date.now()
      
      // Configure scan based on type
      const scanConfig = getScanConfiguration(scanType)
      
      // Initialize scan results
      const scanResults = {
        targetUrl,
        scanType,
        timestamp: new Date().toISOString(),
        scanDuration: 0,
        overallRisk: 'Low',
        securityScore: 85,
        findings: [],
        recommendations: [],
        securityHeaders: {},
        sslAnalysis: {},
        vulnerabilityChecks: {}
      }
  
      // Perform security header analysis
      if (scanConfig.includeHeaders) {
        scanResults.securityHeaders = await performHeaderAnalysis(targetUrl, scanConfig.headerDepth)
      }
  
      // Perform SSL/TLS analysis
      if (scanConfig.includeSSL && parsedUrl.protocol === 'https:') {
        scanResults.sslAnalysis = await performSSLAnalysis(targetUrl, scanConfig.sslDepth)
      }
  
      // Perform vulnerability checks
      if (scanConfig.includeVulnerabilities) {
        scanResults.vulnerabilityChecks = await performVulnerabilityChecks(targetUrl, scanConfig.vulnerabilityDepth)
      }
  
      // Add scan type specific features
      if (scanType === 'full') {
        // Additional comprehensive checks for full audit
        scanResults.advancedChecks = await performAdvancedSecurityChecks(targetUrl)
        scanResults.complianceCheck = await performComplianceCheck(targetUrl)
      }
  
      // Calculate overall security assessment
      const assessment = calculateSecurityAssessment(scanResults, scanType)
      scanResults.overallRisk = assessment.risk
      scanResults.securityScore = assessment.score
      scanResults.findings = assessment.findings
      scanResults.recommendations = assessment.recommendations
  
      scanResults.scanDuration = Date.now() - startTime
  
      return Response.json({
        success: true,
        message: `${scanType === 'quick' ? 'Quick scan' : 'Full security audit'} completed successfully`,
        results: scanResults,
        executedBy: 'Yusuf Aslan - Security Testing Portfolio',
        disclaimer: 'This is a demonstration of security testing methodologies. Results are simulated for portfolio purposes.',
        scanTypeDetails: getScanTypeDescription(scanType)
      })
  
    } catch (error) {
      console.error('Security scan error:', error)
      return Response.json({
        success: false,
        error: error.message,
        troubleshooting: [
          'Ensure the target URL is accessible and valid',
          'Check if the URL supports HTTPS for SSL analysis',
          'Verify the URL format includes protocol (https://)',
          'Some security checks may not work with localhost URLs'
        ],
        message: 'Security scan failed'
      }, { status: 500 })
    }
  }
  
  function getScanConfiguration(scanType) {
    if (scanType === 'quick') {
      return {
        includeHeaders: true,
        includeSSL: true,
        includeVulnerabilities: true,
        headerDepth: 'basic',        // Only check essential headers
        sslDepth: 'basic',          // Basic SSL validation
        vulnerabilityDepth: 'basic' // Top 3-4 most critical vulnerabilities
      }
    } else { // full
      return {
        includeHeaders: true,
        includeSSL: true,
        includeVulnerabilities: true,
        headerDepth: 'comprehensive',    // All security headers + analysis
        sslDepth: 'comprehensive',      // Full SSL/TLS analysis
        vulnerabilityDepth: 'comprehensive' // All OWASP Top 10 + more
      }
    }
  }
  
  function getScanTypeDescription(scanType) {
    if (scanType === 'quick') {
      return {
        focus: 'Essential security basics',
        duration: '5-10 seconds',
        checks: [
          'Core security headers (CSP, HSTS, X-Frame-Options)',
          'Basic SSL/TLS validation',
          'Top 4 critical vulnerabilities (SQL Injection, XSS, CSRF, Directory Traversal)',
          'Basic risk assessment'
        ]
      }
    } else {
      return {
        focus: 'Comprehensive security analysis',
        duration: '15-30 seconds',
        checks: [
          'All security headers with detailed analysis',
          'Complete SSL/TLS assessment with cipher analysis',
          'Full OWASP Top 10 vulnerability testing',
          'Advanced security checks (clickjacking, CORS, etc.)',
          'Compliance assessment (PCI DSS, OWASP guidelines)',
          'Detailed remediation recommendations'
        ]
      }
    }
  }
  
  async function performHeaderAnalysis(targetUrl, depth = 'basic') {
    try {
      // Simulate fetching and analyzing security headers
      const response = await fetch(targetUrl, { 
        method: 'HEAD',
        headers: { 'User-Agent': 'Security-Scanner-Portfolio/1.0' }
      })
      
      const headers = Object.fromEntries(response.headers.entries())
      
      let securityHeaders
      
      if (depth === 'basic') {
        // Quick scan - only check essential headers
        securityHeaders = {
          'content-security-policy': headers['content-security-policy'] || null,
          'strict-transport-security': headers['strict-transport-security'] || null,
          'x-frame-options': headers['x-frame-options'] || null,
          'x-content-type-options': headers['x-content-type-options'] || null
        }
      } else {
        // Full scan - check all security headers
        securityHeaders = {
          'content-security-policy': headers['content-security-policy'] || null,
          'strict-transport-security': headers['strict-transport-security'] || null,
          'x-frame-options': headers['x-frame-options'] || null,
          'x-content-type-options': headers['x-content-type-options'] || null,
          'x-xss-protection': headers['x-xss-protection'] || null,
          'referrer-policy': headers['referrer-policy'] || null,
          'permissions-policy': headers['permissions-policy'] || null,
          'cross-origin-embedder-policy': headers['cross-origin-embedder-policy'] || null,
          'cross-origin-opener-policy': headers['cross-origin-opener-policy'] || null
        }
      }
  
      const totalHeaders = Object.keys(securityHeaders).length
      const presentHeaders = Object.values(securityHeaders).filter(h => h !== null).length
      
      const analysis = {
        headers: securityHeaders,
        present: presentHeaders,
        missing: totalHeaders - presentHeaders,
        score: Math.round((presentHeaders / totalHeaders) * 100),
        recommendations: [],
        scanDepth: depth
      }
  
      // Generate specific recommendations based on scan depth
      if (!securityHeaders['content-security-policy']) {
        analysis.recommendations.push('Implement Content Security Policy (CSP) to prevent XSS attacks')
      }
      if (!securityHeaders['strict-transport-security']) {
        analysis.recommendations.push('Add HTTP Strict Transport Security (HSTS) header')
      }
      
      if (depth === 'comprehensive') {
        if (!securityHeaders['permissions-policy']) {
          analysis.recommendations.push('Consider implementing Permissions Policy for fine-grained feature control')
        }
        if (!securityHeaders['cross-origin-embedder-policy']) {
          analysis.recommendations.push('Add Cross-Origin-Embedder-Policy for additional security')
        }
      }
  
      return analysis
  
    } catch (error) {
      return {
        error: 'Failed to analyze security headers',
        details: error.message,
        score: 0,
        scanDepth: depth
      }
    }
  }
  
  async function performSSLAnalysis(targetUrl, depth = 'basic') {
    // Simulate SSL/TLS analysis with different depths
    const baseSSLData = {
      certificate: {
        valid: true,
        issuer: 'Let\'s Encrypt Authority X3',
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilExpiry: 90,
        wildcardCert: false
      },
      protocols: {
        'TLS 1.3': true,
        'TLS 1.2': true,
        'TLS 1.1': false,
        'TLS 1.0': false
      },
      grade: 'A',
      score: 95,
      scanDepth: depth
    }
  
    if (depth === 'comprehensive') {
      // Add detailed analysis for full scan
      baseSSLData.cipherSuites = {
        strong: 12,
        weak: 0,
        insecure: 0,
        details: [
          'TLS_AES_256_GCM_SHA384',
          'TLS_CHACHA20_POLY1305_SHA256',
          'TLS_AES_128_GCM_SHA256'
        ]
      }
      baseSSLData.vulnerabilities = {
        heartbleed: false,
        poodle: false,
        beast: false,
        crime: false,
        breach: false,
        logjam: false
      }
      baseSSLData.keyExchange = {
        keySize: 2048,
        signatureAlgorithm: 'SHA256withRSA',
        keyExchangeStrength: 'Strong'
      }
    }
  
    const analysis = {
      ...baseSSLData,
      recommendations: []
    }
  
    if (baseSSLData.certificate.daysUntilExpiry < 30) {
      analysis.recommendations.push('SSL certificate expires soon - plan for renewal')
    }
    
    if (depth === 'comprehensive') {
      analysis.recommendations.push('SSL/TLS configuration follows current best practices')
      analysis.recommendations.push('Consider implementing Certificate Transparency monitoring')
    } else {
      analysis.recommendations.push('SSL/TLS configuration appears secure')
    }
  
    return analysis
  }
  
  async function performVulnerabilityChecks(targetUrl, depth = 'basic') {
    let checks
    
    if (depth === 'basic') {
      // Quick scan - only check top 4 critical vulnerabilities
      checks = {
        sqlInjection: {
          tested: true,
          vulnerable: false,
          risk: 'Low',
          description: 'Basic SQL injection pattern testing',
          recommendation: 'Use parameterized queries and input validation'
        },
        xss: {
          tested: true,
          vulnerable: false,
          risk: 'Low', 
          description: 'Cross-Site Scripting vulnerability check',
          recommendation: 'Implement proper input sanitization'
        },
        csrf: {
          tested: true,
          vulnerable: Math.random() > 0.8,
          risk: 'Medium',
          description: 'CSRF protection analysis',
          recommendation: 'Implement CSRF tokens for state-changing operations'
        },
        directoryTraversal: {
          tested: true,
          vulnerable: false,
          risk: 'Low',
          description: 'Directory traversal vulnerability test',
          recommendation: 'Path validation appears properly implemented'
        }
      }
    } else {
      // Full scan - comprehensive OWASP Top 10 + additional checks
      checks = {
        sqlInjection: {
          tested: true,
          vulnerable: false,
          risk: 'Low',
          description: 'Comprehensive SQL injection testing including blind and time-based attacks',
          recommendation: 'Continue using parameterized queries and input validation',
          owaspCategory: 'A03:2021 - Injection'
        },
        xss: {
          tested: true,
          vulnerable: false,
          risk: 'Low', 
          description: 'XSS testing including stored, reflected, and DOM-based XSS',
          recommendation: 'Maintain proper input sanitization and CSP implementation',
          owaspCategory: 'A03:2021 - Injection'
        },
        csrf: {
          tested: true,
          vulnerable: Math.random() > 0.7,
          risk: 'Medium',
          description: 'Cross-Site Request Forgery protection comprehensive analysis',
          recommendation: 'Ensure CSRF tokens are implemented for all state-changing operations',
          owaspCategory: 'A01:2021 - Broken Access Control'
        },
        directoryTraversal: {
          tested: true,
          vulnerable: false,
          risk: 'Low',
          description: 'Path traversal and local file inclusion testing',
          recommendation: 'Path validation and access controls properly implemented',
          owaspCategory: 'A01:2021 - Broken Access Control'
        },
        brokenAuthentication: {
          tested: true,
          vulnerable: Math.random() > 0.9,
          risk: 'High',
          description: 'Authentication bypass and session management testing',
          recommendation: 'Implement strong authentication mechanisms and session security',
          owaspCategory: 'A07:2021 - Identification and Authentication Failures'
        },
        sensitiveDataExposure: {
          tested: true,
          vulnerable: Math.random() > 0.8,
          risk: 'Medium',
          description: 'Sensitive information disclosure analysis',
          recommendation: 'Review error messages and ensure sensitive data protection',
          owaspCategory: 'A02:2021 - Cryptographic Failures'
        },
        securityMisconfiguration: {
          tested: true,
          vulnerable: Math.random() > 0.6,
          risk: 'Medium',
          description: 'Security configuration and hardening assessment',
          recommendation: 'Review server configuration and security settings',
          owaspCategory: 'A05:2021 - Security Misconfiguration'
        },
        insecureDeserialization: {
          tested: true,
          vulnerable: false,
          risk: 'Low',
          description: 'Deserialization vulnerability testing',
          recommendation: 'Avoid deserializing untrusted data when possible',
          owaspCategory: 'A08:2021 - Software and Data Integrity Failures'
        }
      }
    }
  
    const totalChecks = Object.keys(checks).length
    const vulnerableChecks = Object.values(checks).filter(check => check.vulnerable).length
    const score = Math.round(((totalChecks - vulnerableChecks) / totalChecks) * 100)
  
    return {
      checks,
      summary: {
        totalTests: totalChecks,
        vulnerabilities: vulnerableChecks,
        score,
        scanDepth: depth
      }
    }
  }
  
  async function performAdvancedSecurityChecks(targetUrl) {
    // Additional checks only performed in full audit
    return {
      clickjackingProtection: {
        protected: Math.random() > 0.3,
        method: 'X-Frame-Options',
        recommendation: 'Ensure proper clickjacking protection is implemented'
      },
      corsConfiguration: {
        configured: true,
        issues: Math.random() > 0.7 ? ['Overly permissive CORS policy'] : [],
        recommendation: 'Review CORS policy for security implications'
      },
      contentTypeValidation: {
        validated: Math.random() > 0.2,
        recommendation: 'Implement proper content type validation'
      },
      rateLimiting: {
        implemented: Math.random() > 0.5,
        recommendation: 'Consider implementing rate limiting for API endpoints'
      }
    }
  }
  
  async function performComplianceCheck(targetUrl) {
    // Compliance assessment for full audit
    return {
      owaspCompliance: {
        score: Math.floor(Math.random() * 20) + 80, // 80-100%
        recommendation: 'Continue following OWASP security guidelines'
      },
      gdprReadiness: {
        score: Math.floor(Math.random() * 30) + 70, // 70-100%
        recommendation: 'Review data protection and privacy measures'
      },
      industryStandards: {
        score: Math.floor(Math.random() * 25) + 75, // 75-100%
        recommendation: 'Maintain alignment with industry security standards'
      }
    }
  }
  
  function calculateSecurityAssessment(scanResults, scanType) {
    const findings = []
    const recommendations = []
    let totalScore = 0
    let scoreCount = 0
  
    // Analyze security headers
    if (scanResults.securityHeaders.score !== undefined) {
      totalScore += scanResults.securityHeaders.score
      scoreCount++
      
      if (scanResults.securityHeaders.score < 50) {
        findings.push({
          category: 'Security Headers',
          severity: 'High',
          issue: 'Critical security headers missing',
          impact: 'Increased risk of XSS, clickjacking, and other client-side attacks'
        })
      } else if (scanResults.securityHeaders.score < 80) {
        findings.push({
          category: 'Security Headers',
          severity: 'Medium', 
          issue: 'Some security headers missing',
          impact: 'Moderate security risk'
        })
      }
    }
  
    // Analyze SSL/TLS
    if (scanResults.sslAnalysis.score !== undefined) {
      totalScore += scanResults.sslAnalysis.score
      scoreCount++
      
      if (scanResults.sslAnalysis.score < 70) {
        findings.push({
          category: 'SSL/TLS',
          severity: 'High',
          issue: 'SSL/TLS configuration issues detected',
          impact: 'Data transmission may be compromised'
        })
      }
    }
  
    // Analyze vulnerabilities
    if (scanResults.vulnerabilityChecks.summary) {
      const vulnScore = scanResults.vulnerabilityChecks.summary.score
      totalScore += vulnScore
      scoreCount++
      
      if (scanResults.vulnerabilityChecks.summary.vulnerabilities > 0) {
        const severity = scanResults.vulnerabilityChecks.summary.vulnerabilities > 2 ? 'High' : 'Medium'
        findings.push({
          category: 'Application Security',
          severity: severity,
          issue: `${scanResults.vulnerabilityChecks.summary.vulnerabilities} potential vulnerabilities detected`,
          impact: 'Application may be vulnerable to exploitation'
        })
      }
    }
  
    // Calculate overall score
    const overallScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 85
  
    // Determine risk level
    let riskLevel = 'Low'
    if (overallScore < 60) riskLevel = 'High'
    else if (overallScore < 80) riskLevel = 'Medium'
  
    // Generate scan-type specific recommendations
    if (scanType === 'quick') {
      recommendations.push('Consider running a full security audit for comprehensive analysis')
      if (findings.length === 0) {
        recommendations.push('Basic security posture appears adequate')
      }
    } else {
      recommendations.push('Implement regular automated security scanning')
      recommendations.push('Consider penetration testing for comprehensive assessment')
      if (findings.length === 0) {
        recommendations.push('Security posture appears strong - maintain current practices')
      }
    }
  
    if (findings.length > 0) {
      recommendations.push('Address identified security findings based on severity')
      recommendations.push('Implement security training for development team')
    }
  
    return {
      score: overallScore,
      risk: riskLevel,
      findings,
      recommendations
    }
  }