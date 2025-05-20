const { test, expect } = require('@playwright/test');
const AmazonSearchPage = require('./pages/amazon-search.page');

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
  let amazonPage;

  test.beforeEach(async ({ page }) => {
    amazonPage = new AmazonSearchPage(page);
    await amazonPage.navigate();
  });

  test('should search for MacBook Pro on Amazon', async ({ page }) => {
    const searchTerm = 'MacBook Pro';
    console.log(`Starting search for ${searchTerm}`);
    
    try {
      await amazonPage.searchProduct(searchTerm);
      
      // Get and verify product titles
      const productTitles = await amazonPage.getProductTitles(10);
      console.log('\nProduct titles for "MacBook Pro":');
      productTitles.forEach((title, i) => console.log(`${i + 1}. ${title}`));
      console.log('Number of results:', productTitles.length);

      expect(productTitles.length).toBeGreaterThan(0);

      const keywords = ['macbook', 'pro'];
      const hasRelevantResults = productTitles.some(title => {
        const titleLower = title.toLowerCase();
        return keywords.some(word => titleLower.includes(word));
      });
      expect(hasRelevantResults).toBeTruthy();

      // Get and log the price of the first product
      const price = await amazonPage.getFirstProductPrice();
      if (price) {
        console.log(`First product price: ₹${price}`);
      }

      // Get and log the rating of the first product
      const rating = await amazonPage.getFirstProductRating();
      if (rating) {
        console.log(`First product rating: ${rating}`);
      }
    } catch (error) {
      console.error('Test failed:', error);
      await debugResults(page, '[data-component-type="s-search-result"]');
      throw error;
    }
  });

  test('should search for iPhone 15 on Amazon', async ({ page }) => {
    const searchTerm = 'iPhone 15';
    console.log(`Starting search for ${searchTerm}`);
    
    try {
      await amazonPage.searchProduct(searchTerm);
      
      // Get and verify product titles
      const productTitles = await amazonPage.getProductTitles(10);
      console.log('\nProduct titles for "iPhone 15":');
      productTitles.forEach((title, i) => console.log(`${i + 1}. ${title}`));
      console.log('Number of results:', productTitles.length);

      expect(productTitles.length).toBeGreaterThan(0);

      const keywords = ['iphone', '15'];
      const hasRelevantResults = productTitles.some(title => {
        const titleLower = title.toLowerCase();
        return keywords.some(word => titleLower.includes(word));
      });
      expect(hasRelevantResults).toBeTruthy();

      // Get and log the price of the first product
      const price = await amazonPage.getFirstProductPrice();
      if (price) {
        console.log(`First product price: ₹${price}`);
      }

      // Get and log the rating of the first product
      const rating = await amazonPage.getFirstProductRating();
      if (rating) {
        console.log(`First product rating: ${rating}`);
      }
    } catch (error) {
      console.error('Test failed:', error);
      await debugResults(page, '[data-component-type="s-search-result"]');
      throw error;
    }
  });
}); 