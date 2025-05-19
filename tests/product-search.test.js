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
    // Try to extract the product title using the new selector
    const title = await firstResult.$eval('h2 span', el => el.textContent.trim());
    console.log('First product title (h2 span):', title);
  } else {
    // Print the full page HTML (first 2000 chars)
    const html = await page.content();
    console.log('Full page HTML (first 2000 chars):', html.slice(0, 2000));
  }
}

test.describe('Amazon Product Search Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Amazon
    await page.goto('https://www.amazon.in', { waitUntil: 'load' });
    console.log('Navigated to Amazon.in');
    
    // Accept cookies if the dialog appears
    try {
      await page.waitForSelector('#sp-cc-accept', { timeout: 5000 });
      await page.click('#sp-cc-accept');
      console.log('Accepted cookies');
    } catch (e) {
      console.log('No cookie dialog');
    }
  });

  test('should search for MacBook Pro on Amazon', async ({ page }) => {
    await page.waitForSelector('#twotabsearchtextbox', { state: 'visible' });
    await page.click('#twotabsearchtextbox');
    await page.waitForTimeout(1000);
    await page.fill('#twotabsearchtextbox', 'MacBook Pro');
    await page.waitForTimeout(1000);
    await page.press('#twotabsearchtextbox', 'Enter');
    console.log('Searched for MacBook Pro');

    // Wait for search results
    await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 30000, state: 'visible' });
    await page.waitForTimeout(2000);

    // Debug output for selector
    await debugResults(page, '[data-component-type="s-search-result"] h2 span');

    const productTitles = await page.$$eval(
      '[data-component-type="s-search-result"] h2 span',
      elements => elements.map(el => el.textContent.trim())
    );

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
    await page.waitForSelector('#twotabsearchtextbox', { state: 'visible' });
    await page.click('#twotabsearchtextbox');
    await page.waitForTimeout(1000);
    await page.fill('#twotabsearchtextbox', 'iPhone 15');
    await page.waitForTimeout(1000);
    await page.press('#twotabsearchtextbox', 'Enter');
    console.log('Searched for iPhone 15');

    // Wait for search results
    await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 30000, state: 'visible' });
    await page.waitForTimeout(2000);

    // Debug output for selector
    await debugResults(page, '[data-component-type="s-search-result"] h2 span');

    const productTitles = await page.$$eval(
      '[data-component-type="s-search-result"] h2 span',
      elements => elements.map(el => el.textContent.trim())
    );

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