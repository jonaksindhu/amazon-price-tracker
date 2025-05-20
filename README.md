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
- `TC_productSearch_VerifyMacBookProSearch`: MacBook Pro search verification
- `TC_productSearch_VerifyIPhone15Search`: iPhone 15 search verification

### Price Check Tests
- `TC_priceCheck_VerifyMacBookAirPrice`: MacBook Air < $1000
- `TC_priceCheck_VerifyIPhone15Price`: iPhone 15 < $800
- `TC_priceCheck_VerifyAirPodsPrice`: AirPods < $200
- `TC_priceCheck_VerifySamsungGalaxyPrice`: Galaxy S24 < $900
- `TC_priceCheck_VerifySonyHeadphonesPrice`: WH-1000XM5 < $400

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
