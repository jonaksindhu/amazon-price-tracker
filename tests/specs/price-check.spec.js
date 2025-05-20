const { test, expect } = require('@playwright/test');
const AmazonSearchPage = require('../../pages/AmazonSearchPage');

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

// Test cases for different products and price checks
const products = [
  { name: 'MacBook Air', maxPrice: 100000, keywords: ['macbook', 'air'] },
  { name: 'iPhone 15', maxPrice: 80000, keywords: ['iphone', '15'] },
  { name: 'AirPods', maxPrice: 20000, keywords: ['airpods'] },
  { name: 'Samsung Galaxy S24', maxPrice: 90000, keywords: ['samsung', 'galaxy', 's24'] },
  { name: 'Sony WH-1000XM5', maxPrice: 35000, keywords: ['sony', 'wh-1000xm5'] },
];

test.describe('Amazon Product Price Check Tests', () => {
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
    test(`TC_priceCheck_Verify${name.replace(/\s/g, '')}_PriceBelow${maxPrice}_AndRelevantTitles`, async () => {
      // Search for the product
      await amazon.searchProduct(name);
      
      // Get product titles
      const titles = await amazon.getProductTitles(10);
      console.log(`\nProduct titles for "${name}":`);
      titles.forEach((title, i) => console.log(`${i + 1}. ${title}`));
      console.log('Number of results:', titles.length);

      // Assert at least one result
      expect(titles.length).toBeGreaterThan(0);

      // Assert that at least one title contains relevant keywords
      const hasRelevant = titles.some(title =>
        keywords.some(word => title.toLowerCase().includes(word.toLowerCase()))
      );
      expect(hasRelevant).toBeTruthy();

      // Get and check price
      const price = await amazon.getFirstProductPrice();
      console.log(`${name} price:`, price);
      
      if (price) {
        expect(price).toBeLessThan(maxPrice);
      } else {
        console.log(`Warning: Could not find price for ${name}`);
      }
    });
  }

  // Additional test cases for common user scenarios
  test('TC_priceCheck_VerifyDealOfTheDay_ShouldShowDiscountBadge', async () => {
    await amazon.searchProduct('Deal of the Day');
    const dealBadge = await page.$('.a-badge-text');
    expect(dealBadge).toBeTruthy();
    const dealText = await dealBadge.textContent();
    expect(dealText).toContain('deal');
  });

  test('TC_priceCheck_VerifyPrimeEligibleProducts_ShouldShowPrimeBadge', async () => {
    await amazon.searchProduct('Prime eligible products');
    const primeBadge = await page.$('.s-prime-badge');
    expect(primeBadge).toBeTruthy();
    const primeText = await primeBadge.textContent();
    expect(primeText).toContain('Prime');
  });

  test('TC_priceCheck_VerifyProductReviews_ShouldShowRatingStars', async () => {
    await amazon.searchProduct('iPhone 15');
    const ratingElement = await page.$('.a-icon-star');
    expect(ratingElement).toBeTruthy();
    const ratingText = await ratingElement.textContent();
    expect(ratingText).toMatch(/out of 5/);
  });

  test('TC_priceCheck_VerifyProductAvailability_ShouldShowInStockStatus', async () => {
    await amazon.searchProduct('MacBook Air');
    const availabilityElement = await page.$('.a-color-success');
    expect(availabilityElement).toBeTruthy();
    const availabilityText = await availabilityElement.textContent();
    expect(availabilityText).toContain('In Stock');
  });

  test('TC_priceCheck_VerifyProductCategories_ShouldShowDepartment', async () => {
    await amazon.searchProduct('laptop');
    const categoryElement = await page.$('.a-link-normal.a-color-tertiary');
    expect(categoryElement).toBeTruthy();
    const categoryText = await categoryElement.textContent();
    expect(categoryText).toContain('Electronics');
  });

  test('TC_priceCheck_VerifyProductImages_ShouldLoadCorrectly', async () => {
    await amazon.searchProduct('Sony WH-1000XM5');
    const imageElement = await page.$('.s-image');
    expect(imageElement).toBeTruthy();
    const imageSrc = await imageElement.getAttribute('src');
    expect(imageSrc).toBeTruthy();
  });

  test('TC_priceCheck_VerifyProductSorting_ShouldSortByPrice', async () => {
    await amazon.searchProduct('laptop');
    await page.waitForSelector('#s-result-sort-select', { timeout: 10000 });
    await page.selectOption('#s-result-sort-select', 'Price: Low to High');
    await page.waitForSelector('.s-result-item', { timeout: 10000 });
    const prices = await page.$$eval('.a-price .a-offscreen', els => els.map(el => el.textContent));
    const sortedPrices = [...prices].sort((a, b) => parseFloat(a.replace(/[^0-9.-]+/g, '')) - parseFloat(b.replace(/[^0-9.-]+/g, '')));
    expect(prices).toEqual(sortedPrices);
  });

  test('TC_priceCheck_VerifyProductFilters_ShouldApplyBrandFilter', async () => {
    await amazon.searchProduct('headphones');
    await page.waitForSelector('#brandsRefinements', { timeout: 10000 });
    await page.click('#brandsRefinements');
    await page.waitForSelector('text=Samsung', { timeout: 10000 });
    await page.click('text=Samsung');
    await page.waitForSelector('.s-result-item', { timeout: 10000 });
    const titles = await page.$$eval('.a-size-medium', els => els.map(el => el.textContent));
    expect(titles.some(title => title.includes('Samsung'))).toBeTruthy();
  });
});
