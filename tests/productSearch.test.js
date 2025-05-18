const { test, expect } = require('@playwright/test');

test('Amazon Product Search', async ({ page }) => {
  await page.goto('https://www.amazon.in');
  await page.fill('#twotabsearchtextbox', 'iPhone 14');
  await page.click('#nav-search-submit-button');
  
  // Wait for results
  await page.waitForSelector('.s-main-slot');
  
  // Verify search results are displayed
  const title = await page.textContent('.s-title');
  console.log("First Product Title: ", title);
  expect(title).toContain('iPhone');
});
