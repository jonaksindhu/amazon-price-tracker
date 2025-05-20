# Amazon Price Tracker 🚀

Automated price tracking for Amazon products using Playwright.

## Quick Start

```bash
# Install dependencies
npm install
npx playwright install

# Run tests
npm test
```

## Test Cases

### Product Search Tests
- `TC_productSearch_VerifyMacBookProSearchResults_ShouldShowRelevantTitlesPriceAndRating`: Search for MacBook Pro and verify relevant titles, price, and rating.
- `TC_productSearch_VerifyIPhone15SearchResults_ShouldShowRelevantTitlesPriceAndRating`: Search for iPhone 15 and verify relevant titles, price, and rating.

### Price Check Tests
- `TC_priceCheck_VerifyMacBookAir_PriceBelow100000_AndRelevantTitles`: MacBook Air price below 100,000 and relevant titles.
- `TC_priceCheck_VerifyIPhone15_PriceBelow80000_AndRelevantTitles`: iPhone 15 price below 80,000 and relevant titles.
- `TC_priceCheck_VerifyAirPods_PriceBelow20000_AndRelevantTitles`: AirPods price below 20,000 and relevant titles.
- `TC_priceCheck_VerifySamsungGalaxyS24_PriceBelow90000_AndRelevantTitles`: Samsung Galaxy S24 price below 90,000 and relevant titles.
- `TC_priceCheck_VerifySonyWH-1000XM5_PriceBelow35000_AndRelevantTitles`: Sony WH-1000XM5 price below 35,000 and relevant titles.
- `TC_priceCheck_VerifyDealOfTheDay_ShouldShowDiscountBadge`: Deal of the Day should show a discount badge.
- `TC_priceCheck_VerifyPrimeEligibleProducts_ShouldShowPrimeBadge`: Prime eligible products should show Prime badge.
- `TC_priceCheck_VerifyProductReviews_ShouldShowRatingStars`: Product reviews should show rating stars.
- `TC_priceCheck_VerifyProductAvailability_ShouldShowInStockStatus`: Product availability should show in-stock status.
- `TC_priceCheck_VerifyProductCategories_ShouldShowDepartment`: Product categories should show department.
- `TC_priceCheck_VerifyProductImages_ShouldLoadCorrectly`: Product images should load correctly.
- `TC_priceCheck_VerifyProductSorting_ShouldSortByPrice`: Product sorting should sort by price.
- `TC_priceCheck_VerifyProductFilters_ShouldApplyBrandFilter`: Product filters should apply brand filter (Samsung).

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/specs/product-search.spec.js
npx playwright test tests/specs/price-check.spec.js

# Run in headed mode
npx playwright test --headed

# Run in debug mode
npx playwright test --debug
```

## Docker Support

```bash
# Build and run
docker build -t amazon-price-tracker -f docker/Dockerfile .
docker run amazon-price-tracker
```

## Project Structure
```
amazon-price-tracker/
├── tests/
│   ├── specs/                    # Test specifications
│   │   ├── product-search.spec.js
│   │   └── price-check.spec.js
│   ├── utils/                    # Test utilities
│   │   └── test-utils.js
│   └── resources/               # Test resources
├── pages/                        # Page Object Models
│   └── AmazonSearchPage.js
├── docker/                       # Docker configuration
│   └── Dockerfile
├── ci-cd/                        # CI/CD configuration
│   └── Jenkinsfile
├── playwright.config.js          # Playwright configuration
└── package.json
```

## Troubleshooting

- **Test Timeouts**: Check internet connection or increase timeout in `playwright.config.js`
- **Element Not Found**: Run in debug mode to inspect elements
- **Browser Issues**: Reinstall browsers with `npx playwright install`

---

Happy automating! 🛒🤖
