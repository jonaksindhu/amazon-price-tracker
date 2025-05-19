class AmazonSearchPage {
  constructor(page) {
    this.page = page;
    this.searchInput = 'input#twotabsearchtextbox';
    this.searchButton = 'input#nav-search-submit-button';
    this.searchResults = [
      '[data-component-type="s-search-result"]',
      '.s-result-item',
      '.sg-col-4-of-24'
    ];
    this.productTitleSelectors = [
      '[data-component-type="s-search-result"] h2 span',
      '.a-size-medium.a-color-base.a-text-normal',
      '.a-size-base-plus.a-color-base.a-text-normal',
      '[data-component-type="s-search-result"] h2 a span',
      '[data-component-type="s-search-result"] h2'
    ];
    this.priceSelectors = [
      '.a-price .a-offscreen',
      '.a-price-whole',
      '[data-a-color="price"] .a-offscreen',
      '.a-price',
      '.a-color-price'
    ];
    this.ratingSelectors = [
      '.a-icon-star-small span.a-icon-alt',
      '.a-icon-star span.a-icon-alt',
      '.a-icon-star-medium span.a-icon-alt'
    ];
  }

  async navigate() {
    await this.page.goto('https://www.amazon.in', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    await this.page.waitForSelector(this.searchInput, { 
      state: 'visible',
      timeout: 60000 
    });

    // Handle cookies dialog if present
    try {
      await this.page.waitForSelector('#sp-cc-accept', { timeout: 5000 });
      await this.page.click('#sp-cc-accept');
      console.log('Accepted cookies');
    } catch (e) {
      console.log('No cookie dialog');
    }

    // Handle any other popups or overlays
    try {
      await this.page.waitForSelector('.a-button-close', { timeout: 5000 });
      await this.page.click('.a-button-close');
      console.log('Closed popup');
    } catch (e) {
      console.log('No popup to close');
    }
  }

  async searchProduct(productName) {
    const searchBox = await this.page.waitForSelector(this.searchInput, { 
      state: 'visible',
      timeout: 60000 
    });
    await searchBox.click();
    await this.page.waitForTimeout(1000);
    await searchBox.fill('');
    await this.page.waitForTimeout(1000);
    await searchBox.fill(productName);
    await this.page.waitForTimeout(1000);
    await searchBox.press('Enter');
    console.log(`Searched for ${productName}`);

    // Wait for search results with multiple selector attempts
    let resultsFound = false;
    for (const selector of this.searchResults) {
      try {
        await this.page.waitForSelector(selector, { 
          timeout: 30000, 
          state: 'visible' 
        });
        resultsFound = true;
        break;
      } catch (e) {
        console.log(`Search results selector ${selector} not found, trying next...`);
      }
    }

    if (!resultsFound) {
      throw new Error('No search results found with any selector');
    }

    await this.page.waitForTimeout(2000);
  }

  async getProductTitles(maxResults = 10, specificSelector = null) {
    const selectors = specificSelector ? [specificSelector] : this.productTitleSelectors;
    let productHandles = [];
    
    // Try each selector until we find products
    for (const selector of selectors) {
      try {
        productHandles = await this.page.$$(selector);
        if (productHandles.length > 0) {
          console.log(`Found ${productHandles.length} products with selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Selector ${selector} failed, trying next...`);
      }
    }

    // Get titles from the found products
    const titles = [];
    for (let i = 0; i < Math.min(maxResults, productHandles.length); i++) {
      try {
        const title = await productHandles[i].textContent();
        if (title) {
          titles.push(title.trim());
        }
      } catch (e) {
        console.log(`Failed to get title for product ${i + 1}`);
      }
    }

    return titles;
  }

  async getFirstProductPrice() {
    const firstResult = await this.page.$('[data-component-type="s-search-result"]');
    if (!firstResult) {
      console.log('No search results found');
      return null;
    }

    let priceText = null;
    for (const selector of this.priceSelectors) {
      try {
        priceText = await firstResult.$eval(selector, el => el.textContent, { strict: false });
        if (priceText) {
          console.log(`Found price with selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Price selector ${selector} failed, trying next...`);
      }
    }

    if (!priceText) {
      console.log('No price found with any selector');
      return null;
    }

    // Parse price string to number
    const match = priceText.replace(/[^\d]/g, '');
    return match ? parseInt(match, 10) : null;
  }

  async getFirstProductRating() {
    const firstResult = await this.page.$('[data-component-type="s-search-result"]');
    if (!firstResult) {
      console.log('No search results found');
      return null;
    }

    let rating = null;
    for (const selector of this.ratingSelectors) {
      try {
        rating = await firstResult.$eval(selector, el => el.textContent);
        if (rating) {
          console.log(`Found rating with selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Rating selector ${selector} failed, trying next...`);
      }
    }

    return rating;
  }

  async verifyProductTitles(titles, keywords) {
    for (const title of titles) {
      const titleLower = title.toLowerCase();
      const matched = keywords.some(word => titleLower.includes(word.toLowerCase()));
      if (!matched) {
        throw new Error(`Product title "${title}" does not contain any of the keywords: ${keywords.join(', ')}`);
      }
    }
  }
}

module.exports = AmazonSearchPage; 