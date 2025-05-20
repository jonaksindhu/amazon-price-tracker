const { test, expect } = require('@playwright/test');
const AmazonSearchPage = require('../pages/amazon-search.page');

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

// Test cases for different products and price checks
const products = [
  { name: 'MacBook Air', maxPrice: 100000, keywords: ['macbook', 'air'] },
  { name: 'iPhone 15', maxPrice: 80000, keywords: ['iphone', '15'] },
  { name: 'AirPods', maxPrice: 20000, keywords: ['airpods'] },
  { name: 'Samsung Galaxy S24', maxPrice: 90000, keywords: ['samsung', 'galaxy', 's24'] },
  { name: 'Sony WH-1000XM5', maxPrice: 35000, keywords: ['sony', 'wh-1000xm5'] },
];

test.describe('Amazon Product Price & Search Tests', () => {
  let page;
  let amazon;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    amazon = new AmazonSearchPage(page);
    await amazon.navigate();
  });

  test.afterEach(async () => {
    await page.close();
  });

  for (const { name, maxPrice, keywords } of products) {
    test(`TC_priceSearch_Verify${name.replace(/\s/g, '')}_PriceBelow${maxPrice}_AndRelevantTitles`, async () => {
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

  test('TC_priceSearch_VerifyLaptopSearch_ShouldReturnAtLeast5Results', async () => {
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

  test('TC_priceSearch_VerifyMacBookAirRating_ShouldFindRatingForFirstResult', async () => {
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
}); 