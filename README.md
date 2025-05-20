# Amazon Price Tracker 🚀

A small automation project using Playwright to track Amazon product prices and stock availability.

## Overview

This project automates the process of searching for products on Amazon, checking their prices, and verifying stock availability. It uses Playwright for browser automation and is designed to be easily extended with additional features.

## Features

- Opens Amazon website
- Searches for products and verifies results
- Checks product prices against maximum thresholds
- Verifies product titles and availability
- Organized folder structure for tests, configuration, reports, and scripts

## Test Cases

### Product Search Tests (`tests/specs/product-search.spec.js`)
- `TC_productSearch_VerifyMacBookProSearch`: Searches for "MacBook Pro" and verifies relevant results
- `TC_productSearch_VerifyIPhone15Search`: Searches for "iPhone 15" and verifies relevant results

### Price Check Tests (`tests/specs/price-check.spec.js`)
- `TC_priceCheck_VerifyMacBookAirPrice`: Checks if MacBook Air price is below $1000
- `TC_priceCheck_VerifyIPhone15Price`: Checks if iPhone 15 price is below $800
- `TC_priceCheck_VerifyAirPodsPrice`: Checks if AirPods price is below $200
- `TC_priceCheck_VerifySamsungGalaxyPrice`: Checks if Samsung Galaxy S24 price is below $900
- `TC_priceCheck_VerifySonyHeadphonesPrice`: Checks if Sony WH-1000XM5 price is below $400

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/amazon-price-tracker.git
   cd amazon-price-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Running Tests

1. Run all tests:
   ```bash
   npm test
   ```

2. Run specific test file:
   ```bash
   npx playwright test tests/specs/product-search.spec.js
   npx playwright test tests/specs/price-check.spec.js
   ```

3. Run tests in headed mode (to see the browser):
   ```bash
   npx playwright test --headed
   ```

4. Run tests in debug mode:
   ```bash
   npx playwright test --debug
   ```

5. Run tests with specific browser:
   ```bash
   npx playwright test --project=chromium
   npx playwright test --project=firefox
   npx playwright test --project=webkit
   ```

## Test Configuration

The test configuration is managed in `playwright.config.js`:
- Default timeout: 30 seconds
- Retry failed tests: 2 times
- Parallel execution: 4 workers
- Browser: Chromium by default
- Headless mode: true by default

## Project Structure

```
amazon-price-tracker/
├── tests/
│   ├── specs/                    # Test specifications
│   │   ├── product-search.spec.js
│   │   └── price-check.spec.js
│   └── utils/                    # Test utilities
│       └── test-utils.js
├── pages/                        # Page Object Models
│   └── AmazonSearchPage.js
├── playwright.config.js          # Playwright configuration
└── package.json
```

## Troubleshooting

1. **Test Timeouts**: If tests fail due to timeouts:
   - Check your internet connection
   - Increase timeout in `playwright.config.js`
   - Run tests in headed mode to debug

2. **Element Not Found**: If tests fail to find elements:
   - Check if Amazon's structure has changed
   - Verify selectors in page objects
   - Run in debug mode to inspect elements

3. **Browser Issues**: If browser-related errors occur:
   - Reinstall Playwright browsers: `npx playwright install`
   - Try a different browser: `--project=firefox`
   - Check browser compatibility

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request. Ensure you:
1. Add tests for new features
2. Follow the existing test naming convention (TC_*)
3. Update documentation for new features
4. Keep the code modular and maintainable

## Docker Support

### Building and Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t amazon-price-tracker .
   ```

2. Run the container:
   ```bash
   docker run amazon-price-tracker
   ```

### Docker Configuration Details

The project includes a `Dockerfile` with the following features:
- Uses Node.js 18 slim image for smaller size
- Installs only Chromium browser to reduce image size
- Sets up proper working directory and environment variables
- Optimizes layer caching for faster builds
- Includes all necessary dependencies for Playwright

### Docker Commands Reference

1. Build with specific tag:
   ```bash
   docker build -t amazon-price-tracker:v1.0 .
   ```

2. Run in interactive mode:
   ```bash
   docker run -it amazon-price-tracker
   ```

3. Run with volume mounting (for development):
   ```bash
   docker run -v $(pwd):/app amazon-price-tracker
   ```

4. View container logs:
   ```bash
   docker logs <container_id>
   ```

---

Happy automating! 🛒🤖
