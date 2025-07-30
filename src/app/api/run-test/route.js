import { chromium } from 'playwright'

export async function POST(request) {
  try {
    const { testType } = await request.json()
    
    console.log(`Starting ${testType} test execution...`)
    
    // Launch browser
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })
    
    const page = await context.newPage()
    
    let testResults = {
      testType,
      success: false,
      duration: 0,
      steps: [],
      screenshot: null,
      error: null,
      timestamp: new Date().toISOString()
    }
    
    const startTime = Date.now()
    
    try {
      // Different test scenarios based on testType
      switch (testType) {
        case 'login-demo':
          testResults = await runLoginDemo(page, testResults)
          break
        case 'search-demo':
          testResults = await runSearchDemo(page, testResults)
          break
        case 'form-demo':
          testResults = await runFormDemo(page, testResults)
          break
        default:
          testResults = await runDefaultDemo(page, testResults)
      }
      
      testResults.success = true
      
    } catch (error) {
      console.error('Test execution failed:', error)
      testResults.error = error.message
      testResults.steps.push({
        step: 'Error occurred',
        description: error.message,
        timestamp: Date.now() - startTime
      })
    }
    
    // Take final screenshot
    const screenshotBuffer = await page.screenshot({ 
      fullPage: false,
      type: 'png'
    })
    testResults.screenshot = `data:image/png;base64,${screenshotBuffer.toString('base64')}`
    
    // Calculate total duration
    testResults.duration = Date.now() - startTime
    
    await browser.close()
    
    console.log(`Test completed in ${testResults.duration}ms`)
    
    return Response.json({
      ...testResults,
      message: 'Test execution completed',
      executedBy: 'Yusuf Aslan - SDET Portfolio Demo'
    })
    
  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      { 
        success: false, 
        error: error.message,
        message: 'Test execution failed'
      }, 
      { status: 500 }
    )
  }
}

// Demo test scenarios
async function runLoginDemo(page, testResults) {
  const steps = []
  
  // Step 1: Navigate to demo site
  steps.push({
    step: 1,
    action: 'Navigate to demo site',
    description: 'Opening GitHub login page for demonstration',
    timestamp: Date.now()
  })
  
  await page.goto('https://github.com/login', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  
  // Step 2: Locate login elements
  steps.push({
    step: 2,
    action: 'Locate form elements',
    description: 'Finding username and password fields',
    timestamp: Date.now()
  })
  
  const usernameField = await page.locator('#login_field')
  const passwordField = await page.locator('#password')
  const submitButton = await page.locator('input[type="submit"]')
  
  // Step 3: Validate form elements exist
  steps.push({
    step: 3,
    action: 'Validate elements',
    description: 'Confirming all form elements are present and visible',
    timestamp: Date.now()
  })
  
  await expect(usernameField).toBeVisible()
  await expect(passwordField).toBeVisible()
  await expect(submitButton).toBeVisible()
  
  // Step 4: Test form interaction (without actually submitting)
  steps.push({
    step: 4,
    action: 'Test form interaction',
    description: 'Testing form field interactions (demo purposes only)',
    timestamp: Date.now()
  })
  
  await usernameField.fill('demo-test-user')
  await passwordField.fill('demo-password')
  await page.waitForTimeout(500)
  
  // Step 5: Validate form state
  steps.push({
    step: 5,
    action: 'Validate form state',
    description: 'Confirming form fields contain expected values',
    timestamp: Date.now()
  })
  
  const usernameValue = await usernameField.inputValue()
  const passwordValue = await passwordField.inputValue()
  
  if (usernameValue === 'demo-test-user' && passwordValue === 'demo-password') {
    steps.push({
      step: 6,
      action: 'Test completed successfully',
      description: 'Login form validation test passed - all elements functional',
      timestamp: Date.now()
    })
  }
  
  testResults.steps = steps
  return testResults
}

async function runSearchDemo(page, testResults) {
  const steps = []
  
  steps.push({
    step: 1,
    action: 'Navigate to search page',
    description: 'Opening DuckDuckGo search engine',
    timestamp: Date.now()
  })
  
  await page.goto('https://duckduckgo.com', { waitUntil: 'networkidle' })
  
  steps.push({
    step: 2,
    action: 'Locate search elements',
    description: 'Finding search input field and search button',
    timestamp: Date.now()
  })
  
  const searchInput = await page.locator('input[name="q"]')
  await expect(searchInput).toBeVisible()
  
  steps.push({
    step: 3,
    action: 'Perform search',
    description: 'Searching for "Playwright testing automation"',
    timestamp: Date.now()
  })
  
  await searchInput.fill('Playwright testing automation')
  await page.keyboard.press('Enter')
  await page.waitForLoadState('networkidle')
  
  steps.push({
    step: 4,
    action: 'Validate search results',
    description: 'Confirming search results are displayed',
    timestamp: Date.now()
  })
  
  const results = await page.locator('[data-testid="result"]').first()
  await expect(results).toBeVisible()
  
  steps.push({
    step: 5,
    action: 'Test completed',
    description: 'Search functionality validated successfully',
    timestamp: Date.now()
  })
  
  testResults.steps = steps
  return testResults
}

async function runFormDemo(page, testResults) {
  const steps = []
  
  steps.push({
    step: 1,
    action: 'Navigate to form demo',
    description: 'Opening HTML form testing page',
    timestamp: Date.now()
  })
  
  await page.goto('https://httpbin.org/forms/post', { waitUntil: 'networkidle' })
  
  steps.push({
    step: 2,
    action: 'Fill form fields',
    description: 'Testing various form input types',
    timestamp: Date.now()
  })
  
  await page.fill('input[name="custname"]', 'Test User')
  await page.fill('input[name="custtel"]', '555-1234')
  await page.fill('input[name="custemail"]', 'test@example.com')
  await page.selectOption('select[name="size"]', 'large')
  
  steps.push({
    step: 3,
    action: 'Validate form state',
    description: 'Confirming all form fields contain expected values',
    timestamp: Date.now()
  })
  
  const nameValue = await page.inputValue('input[name="custname"]')
  const emailValue = await page.inputValue('input[name="custemail"]')
  
  if (nameValue === 'Test User' && emailValue === 'test@example.com') {
    steps.push({
      step: 4,
      action: 'Form validation passed',
      description: 'All form fields validated successfully',
      timestamp: Date.now()
    })
  }
  
  testResults.steps = steps
  return testResults
}

async function runDefaultDemo(page, testResults) {
  const steps = []
  
  steps.push({
    step: 1,
    action: 'Navigate to test page',
    description: 'Opening example.com for basic functionality test',
    timestamp: Date.now()
  })
  
  await page.goto('https://example.com', { waitUntil: 'networkidle' })
  
  steps.push({
    step: 2,
    action: 'Validate page load',
    description: 'Confirming page loaded successfully',
    timestamp: Date.now()
  })
  
  const title = await page.title()
  const heading = await page.locator('h1').textContent()
  
  steps.push({
    step: 3,
    action: 'Validate page content',
    description: `Page title: "${title}", Main heading: "${heading}"`,
    timestamp: Date.now()
  })
  
  testResults.steps = steps
  return testResults
}

// Add expect function for assertions
async function expect(locator) {
  return {
    toBeVisible: async () => {
      await locator.waitFor({ state: 'visible', timeout: 5000 })
      return true
    }
  }
}