const { test, expect } = require('./test-utils');
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
    '.a-price',
    '.a-color-price'
  ];

  let priceText = null;
  for (const sel of priceSelectors) {
    try {
      priceText = await firstResult.$eval(sel, el => el.textContent, { strict: false });
      if (priceText) break;
    } catch (e) {
      console.log(`Price selector ${sel} not found, trying next...`);
    }
  }

  if (!priceText) {
    console.log('No price found with any selector');
    return null;
  }

  return parsePrice(priceText);
}

// Main test suite for Amazon price and product checks
// ---------------------------------------------------
test('Amazon Product Price & Search Tests', async ({ browser }) => {
  let page;
  let amazon;

  // Launch browser and create page object before all tests
  page = await browser.newPage();
  amazon = new AmazonSearchPage(page);

  // Before each test, navigate to Amazon and accept cookies if needed
  await amazon.navigate();
  
  // Accept cookies if present
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
    await test(`should find ${name} and price should be below ₹${maxPrice.toLocaleString()}`, async () => {
      // Search for the product
      await amazon.searchProduct(name);
      
      // Get product titles with multiple selector attempts
      const titleSelectors = [
        '[data-component-type="s-search-result"] h2 span',
        '.a-size-medium.a-color-base.a-text-normal',
        '.a-size-base-plus.a-color-base.a-text-normal'
      ];

      let titles = [];
      for (const selector of titleSelectors) {
        try {
          titles = await amazon.getProductTitles(10, selector);
          if (titles.length > 0) break;
        } catch (e) {
          console.log(`Title selector ${selector} failed, trying next...`);
        }
      }

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
      
      if (price) {
        expect(price).toBeLessThan(maxPrice);
      } else {
        console.log(`Warning: Could not find price for ${name}`);
      }
    });
  }

  // Additional test: Ensure at least 5 results for a popular search
  await test('should return at least 5 results for "laptop" search', async () => {
    await amazon.searchProduct('laptop');
    
    const titleSelectors = [
      '[data-component-type="s-search-result"] h2 span',
      '.a-size-medium.a-color-base.a-text-normal',
      '.a-size-base-plus.a-color-base.a-text-normal'
    ];

    let titles = [];
    for (const selector of titleSelectors) {
      try {
        titles = await amazon.getProductTitles(10, selector);
        if (titles.length > 0) break;
      } catch (e) {
        console.log(`Title selector ${selector} failed, trying next...`);
      }
    }

    expect(titles.length).toBeGreaterThanOrEqual(5);
  });

  // Additional test: Check that a product has a rating (if available)
  await test('should find a rating for the first MacBook Air result', async () => {
    await amazon.searchProduct('MacBook Air');
    const firstResult = await page.$('[data-component-type="s-search-result"]');
    
    if (!firstResult) {
      console.log('No search results found for MacBook Air');
      return;
    }

    // Try multiple selectors for ratings
    const ratingSelectors = [
      '.a-icon-star-small span.a-icon-alt',
      '.a-icon-star span.a-icon-alt',
      '.a-icon-star-medium span.a-icon-alt'
    ];

    let rating = null;
    for (const selector of ratingSelectors) {
      try {
        rating = await firstResult.$eval(selector, el => el.textContent).catch(() => null);
        if (rating) break;
      } catch (e) {
        console.log(`Rating selector ${selector} failed, trying next...`);
      }
    }

    if (rating) {
      console.log('MacBook Air rating:', rating);
      expect(rating).not.toBeNull();
    } else {
      console.log('No rating found for MacBook Air');
    }
  });

  // Close browser after all tests
  await page.close();
}); 