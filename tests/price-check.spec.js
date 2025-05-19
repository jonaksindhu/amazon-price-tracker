const { test, expect } = require('@playwright/test');
const AmazonSearchPage = require('./pages/amazon-search.page');

// Utility to extract price as a number from a string like '₹1,19,900'
function parsePrice(priceStr) {
  if (!priceStr) return null;
  const match = priceStr.replace(/[^\d]/g, '');
  return match ? parseInt(match, 10) : null;
}

// Utility to extract price for the first product result
async function getFirstProductPrice(page) {
  // Try common price selectors inside the first search result
  const firstResult = await page.$('[data-component-type="s-search-result"]');
  if (!firstResult) throw new Error('No search results found');
  const priceSelectors = [
    '.a-price .a-offscreen',
    '.a-price-whole',
    '[data-a-color="price"] .a-offscreen',
  ];
  let priceText = null;
  for (const sel of priceSelectors) {
    priceText = await firstResult.$eval(sel, el => el.textContent, { strict: false }).catch(() => null);
    if (priceText) break;
  }
  return parsePrice(priceText);
}

// Main test suite for Amazon price and product checks
// ---------------------------------------------------
test.describe('Amazon Product Price & Search Tests', () => {
  let page;
  let amazon;

  // Launch browser and create page object before all tests
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    amazon = new AmazonSearchPage(page);
  });

  // Close browser after all tests
  test.afterAll(async () => {
    await page.close();
  });

  // Before each test, navigate to Amazon and accept cookies if needed
  test.beforeEach(async () => {
    await amazon.navigate();
    // Accept cookies if present
    try {
      await page.waitForSelector('#sp-cc-accept', { timeout: 5000 });
      await page.click('#sp-cc-accept');
    } catch (e) {}
  });

  // Test cases for different products and price checks
  // --------------------------------------------------
  const products = [
    { name: 'MacBook Air', maxPrice: 100000, keywords: ['macbook', 'air'] },
    { name: 'iPhone 15', maxPrice: 80000, keywords: ['iphone', '15'] },
    { name: 'AirPods', maxPrice: 20000, keywords: ['airpods'] },
    { name: 'Samsung Galaxy S24', maxPrice: 90000, keywords: ['samsung', 'galaxy', 's24'] },
    { name: 'Sony WH-1000XM5', maxPrice: 35000, keywords: ['sony', 'wh-1000xm5'] },
  ];

  for (const { name, maxPrice, keywords } of products) {
    test(`should find ${name} and price should be below ₹${maxPrice.toLocaleString()}`, async () => {
      // Search for the product
      await amazon.searchProduct(name);
      // Get product titles
      const titles = await amazon.getProductTitles(10);
      // Assert at least one result
      expect(titles.length).toBeGreaterThan(0);
      // Assert that at least one title contains relevant keywords
      const hasRelevant = titles.some(title =>
        keywords.some(word => title.toLowerCase().includes(word.toLowerCase()))
      );
      expect(hasRelevant).toBeTruthy();
      // Extract and check price
      const price = await getFirstProductPrice(page);
      console.log(`${name} price:`, price);
      expect(price).toBeLessThan(maxPrice);
    });
  }

  // Additional test: Ensure at least 5 results for a popular search
  test('should return at least 5 results for "laptop" search', async () => {
    await amazon.searchProduct('laptop');
    const titles = await amazon.getProductTitles(10);
    expect(titles.length).toBeGreaterThanOrEqual(5);
  });

  // Additional test: Check that a product has a rating (if available)
  test('should find a rating for the first MacBook Air result', async () => {
    await amazon.searchProduct('MacBook Air');
    const firstResult = await page.$('[data-component-type="s-search-result"]');
    // Try to get the rating element
    const rating = await firstResult?.$eval('.a-icon-star-small span.a-icon-alt', el => el.textContent).catch(() => null);
    expect(rating).not.toBeNull();
    console.log('MacBook Air rating:', rating);
  });
});
