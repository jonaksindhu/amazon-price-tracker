const { test, expect } = require('@playwright/test');

async function debugResults(page, selector) {
  // Print the number of matching elements
  const count = await page.$$eval(selector, els => els.length);
  console.log(`Selector '${selector}' matched ${count} elements.`);
  
  // Print the full HTML of the first s-search-result div
  const firstResult = await page.$('[data-component-type="s-search-result"]');
  if (firstResult) {
    const outer = await firstResult.evaluate(el => el.outerHTML);
    console.log('Full first s-search-result HTML:', outer.slice(0, 1000));
    // Try multiple selectors for product title
    const titleSelectors = [
      'h2 span',
      '.a-size-medium.a-color-base.a-text-normal',
      '.a-size-base-plus.a-color-base.a-text-normal'
    ];
    for (const sel of titleSelectors) {
      const title = await firstResult.$eval(sel, el => el.textContent.trim()).catch(() => null);
      if (title) {
        console.log(`First product title (${sel}):`, title);
        break;
      }
    }
  } else {
    // Print the full page HTML (first 2000 chars)
    const html = await page.content();
    console.log('Full page HTML (first 2000 chars):', html.slice(0, 2000));
  }
}

test.describe('Amazon Product Search Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Amazon with increased timeout
    await page.goto('https://www.amazon.in', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    console.log('Navigated to Amazon.in');
    
    // Accept cookies if the dialog appears
    try {
      await page.waitForSelector('#sp-cc-accept', { timeout: 5000 });
      await page.click('#sp-cc-accept');
      console.log('Accepted cookies');
    } catch (e) {
      console.log('No cookie dialog');
    }

    // Handle any other popups or overlays
    try {
      await page.waitForSelector('.a-button-close', { timeout: 5000 });
      await page.click('.a-button-close');
      console.log('Closed popup');
    } catch (e) {
      console.log('No popup to close');
    }
  });

  test('should search for MacBook Pro on Amazon', async ({ page }) => {
    // Wait for and interact with search box
    const searchBox = await page.waitForSelector('#twotabsearchtextbox', { 
      state: 'visible',
      timeout: 60000 
    });
    await searchBox.click();
    await page.waitForTimeout(1000);
    await searchBox.fill('MacBook Pro');
    await page.waitForTimeout(1000);
    await searchBox.press('Enter');
    console.log('Searched for MacBook Pro');

    // Wait for search results with increased timeout and multiple selectors
    const resultSelectors = [
      '[data-component-type="s-search-result"]',
      '.s-result-item',
      '.sg-col-4-of-24'
    ];

    let resultsFound = false;
    for (const selector of resultSelectors) {
      try {
        await page.waitForSelector(selector, { 
          timeout: 30000, 
          state: 'visible' 
        });
        resultsFound = true;
        break;
      } catch (e) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }

    if (!resultsFound) {
      throw new Error('No search results found with any selector');
    }

    await page.waitForTimeout(2000);

    // Debug output for selector
    await debugResults(page, '[data-component-type="s-search-result"]');

    // Try multiple selectors for product titles
    const titleSelectors = [
      '[data-component-type="s-search-result"] h2 span',
      '.a-size-medium.a-color-base.a-text-normal',
      '.a-size-base-plus.a-color-base.a-text-normal'
    ];

    let productTitles = [];
    for (const selector of titleSelectors) {
      try {
        productTitles = await page.$$eval(
          selector,
          elements => elements.map(el => el.textContent.trim())
        );
        if (productTitles.length > 0) break;
      } catch (e) {
        console.log(`Selector ${selector} failed, trying next...`);
      }
    }

    console.log('\nProduct titles for "MacBook Pro":');
    productTitles.slice(0, 10).forEach((title, i) => console.log(`${i + 1}. ${title}`));
    console.log('Number of results:', productTitles.length);

    expect(productTitles.length).toBeGreaterThan(0);

    const keywords = ['macbook', 'pro'];
    const hasRelevantResults = productTitles.some(title => {
      const titleLower = title.toLowerCase();
      return keywords.some(word => titleLower.includes(word));
    });
    expect(hasRelevantResults).toBeTruthy();
  });

  test('should search for iPhone 15 on Amazon', async ({ page }) => {
    // Wait for and interact with search box
    const searchBox = await page.waitForSelector('#twotabsearchtextbox', { 
      state: 'visible',
      timeout: 60000 
    });
    await searchBox.click();
    await page.waitForTimeout(1000);
    await searchBox.fill('iPhone 15');
    await page.waitForTimeout(1000);
    await searchBox.press('Enter');
    console.log('Searched for iPhone 15');

    // Wait for search results with increased timeout and multiple selectors
    const resultSelectors = [
      '[data-component-type="s-search-result"]',
      '.s-result-item',
      '.sg-col-4-of-24'
    ];

    let resultsFound = false;
    for (const selector of resultSelectors) {
      try {
        await page.waitForSelector(selector, { 
          timeout: 30000, 
          state: 'visible' 
        });
        resultsFound = true;
        break;
      } catch (e) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }

    if (!resultsFound) {
      throw new Error('No search results found with any selector');
    }

    await page.waitForTimeout(2000);

    // Debug output for selector
    await debugResults(page, '[data-component-type="s-search-result"]');

    // Try multiple selectors for product titles
    const titleSelectors = [
      '[data-component-type="s-search-result"] h2 span',
      '.a-size-medium.a-color-base.a-text-normal',
      '.a-size-base-plus.a-color-base.a-text-normal'
    ];

    let productTitles = [];
    for (const selector of titleSelectors) {
      try {
        productTitles = await page.$$eval(
          selector,
          elements => elements.map(el => el.textContent.trim())
        );
        if (productTitles.length > 0) break;
      } catch (e) {
        console.log(`Selector ${selector} failed, trying next...`);
      }
    }

    console.log('\nProduct titles for "iPhone 15":');
    productTitles.slice(0, 10).forEach((title, i) => console.log(`${i + 1}. ${title}`));
    console.log('Number of results:', productTitles.length);

    expect(productTitles.length).toBeGreaterThan(0);

    const keywords = ['iphone', '15'];
    const hasRelevantResults = productTitles.some(title => {
      const titleLower = title.toLowerCase();
      return keywords.some(word => titleLower.includes(word));
    });
    expect(hasRelevantResults).toBeTruthy();
  });
}); 