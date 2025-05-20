const { test, expect } = require('@playwright/test');

// Helper to extract price as a number from a string like '₹1,19,900'
function parsePrice(priceStr) {
  if (!priceStr) return null;
  const match = priceStr.replace(/[^\d]/g, '');
  return match ? parseInt(match, 10) : null;
}

async function getFirstProductPrice(page) {
  // Wait for search results
  await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 30000 });
  // Find the first result
  const firstResult = await page.$('[data-component-type="s-search-result"]');
  if (!firstResult) throw new Error('No search results found');
  // Try to get the price from common selectors
  const priceSelectors = [
    '.a-price .a-offscreen', // Most common
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

test.describe('Amazon Price Check Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.amazon.in', { waitUntil: 'load' });
    // Accept cookies if present
    try {
      await page.waitForSelector('#sp-cc-accept', { timeout: 5000 });
      await page.click('#sp-cc-accept');
    } catch (e) {}
  });

  test('MacBook Air price should be below ₹1,00,000 on Amazon India', async ({ page }) => {
    await page.fill('#twotabsearchtextbox', 'MacBook Air');
    await page.press('#twotabsearchtextbox', 'Enter');
    const price = await getFirstProductPrice(page);
    console.log('MacBook Air price:', price);
    expect(price).toBeLessThan(100000);
  });

  test('iPhone 15 price should be below ₹80,000 on Amazon India', async ({ page }) => {
    await page.fill('#twotabsearchtextbox', 'iPhone 15');
    await page.press('#twotabsearchtextbox', 'Enter');
    const price = await getFirstProductPrice(page);
    console.log('iPhone 15 price:', price);
    expect(price).toBeLessThan(80000);
  });

  test('AirPods price should be below ₹20,000 on Amazon India', async ({ page }) => {
    await page.fill('#twotabsearchtextbox', 'AirPods');
    await page.press('#twotabsearchtextbox', 'Enter');
    const price = await getFirstProductPrice(page);
    console.log('AirPods price:', price);
    expect(price).toBeLessThan(20000);
  });
}); 