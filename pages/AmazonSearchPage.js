class AmazonSearchPage {
  constructor(page) {
    this.page = page;
    this.url = 'https://www.amazon.in/';
    this.searchBoxSelector = 'input#twotabsearchtextbox';
    this.searchButtonSelector = 'input#nav-search-submit-button';
    this.resultSelector = '[data-component-type="s-search-result"]';
  }

  async navigate() {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector(this.searchBoxSelector, { timeout: 10000 });
  }

  async searchProduct(productName) {
    await this.page.fill(this.searchBoxSelector, productName);
    await this.page.click(this.searchButtonSelector);
    await this.page.waitForSelector(this.resultSelector, { timeout: 15000 });
  }

  async getProductTitles(limit = 10) {
    const titles = await this.page.$$eval(
      `${this.resultSelector} h2 span`,
      (elements, limit) => elements.slice(0, limit).map(el => el.textContent.trim()),
      limit
    );
    return titles;
  }

  async getFirstProductPrice() {
    const firstResult = await this.page.$(this.resultSelector);
    if (!firstResult) return null;
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
    if (!priceText) return null;
    // Remove non-digit characters
    const match = priceText.replace(/[^\d]/g, '');
    return match ? parseInt(match, 10) : null;
  }

  async getFirstProductRating() {
    const firstResult = await this.page.$(this.resultSelector);
    if (!firstResult) return null;
    const ratingSelectors = [
      '.a-icon-alt',
      '[data-asin] .a-row.a-size-small span[aria-label*="out of 5 stars"]',
    ];
    let ratingText = null;
    for (const sel of ratingSelectors) {
      ratingText = await firstResult.$eval(sel, el => el.textContent, { strict: false }).catch(() => null);
      if (ratingText) break;
    }
    return ratingText;
  }
}

module.exports = AmazonSearchPage; 