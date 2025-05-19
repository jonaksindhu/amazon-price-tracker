// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Amazon Tests', () => {
  test('Amazon title validation', async ({ page }) => {
    // Navigate to Amazon
    await page.goto('https://www.amazon.in');
    
    // Verify the page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Assert that the title contains "Amazon"
    expect(title).toContain('Amazon');
  });
}); 