class AmazonSearchPage {
  constructor(page) {
    this.page = page;
    this.searchInput = 'input#twotabsearchtextbox';
    this.searchButton = 'input#nav-search-submit-button';
    this.searchResults = '[data-component-type="s-search-result"]';
    this.productTitleSelectors = [
      '[data-component-type="s-search-result"] h2 a span',
      '[data-component-type="s-search-result"] h2',
      '[data-component-type="s-search-result"] .a-size-medium'
    ];
  }

  async navigate() {
    await this.page.goto('https://www.amazon.in');
    await this.page.waitForSelector(this.searchInput, { state: 'visible' });
  }

  async searchProduct(productName) {
    await this.page.fill(this.searchInput, '');
    await this.page.fill(this.searchInput, productName);
    await this.page.click(this.searchButton);
    await this.page.waitForSelector(this.searchResults, { 
      timeout: 30000,
      state: 'visible'
    });
  }

  async getProductTitles(maxResults = 10) {
    let productHandles = [];
    
    // Try each selector until we find products
    for (const selector of this.productTitleSelectors) {
      productHandles = await this.page.$$(selector);
      if (productHandles.length > 0) break;
    }

    // Get titles from the found products
    const titles = [];
    for (let i = 0; i < Math.min(maxResults, productHandles.length); i++) {
      const title = await productHandles[i].textContent();
      if (title) {
        titles.push(title.trim());
      }
    }

    return titles;
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