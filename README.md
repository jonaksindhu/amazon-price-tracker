# Amazon Price Tracker 🚀

A small automation project using Playwright to track Amazon product prices and stock availability.

## Overview

This project automates the process of searching for products on Amazon, checking their prices, and verifying stock availability. It uses Playwright for browser automation and is designed to be easily extended with additional features.

## Features

- Opens Amazon website
- Searches for a product
- Checks the first product title to ensure results are displayed
- Organized folder structure for tests, configuration, reports, and scripts

## Upcoming Features

- Get actual prices and check if products are in stock
- Generate browser-based reports
- Send email alerts when prices drop
- Docker support for easy deployment
- CI/CD pipeline integration with Jenkins or GitHub Actions

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

3. Run the tests:
   ```bash
   npx playwright test
   ```

## Advanced Usage

- **Headless Mode**: For faster execution, set `headless: true` in `playwright.config.js` or run with `npx playwright test --headed=false`.
- **Browser Cleanup**: Playwright automatically closes browsers after tests. Avoid manual `page.close()` calls.
- **Test Structure**: Tests are organized using the Page Object Model. Add new test files in the `tests/` folder and use the `pages/` subfolder for reusable page objects.
- **Troubleshooting**: If tests fail due to timeouts, increase the timeout in `playwright.config.js` or check your network connection.

## CI/CD

This project is set up for continuous integration and deployment. The CI/CD pipeline is configured to run tests automatically on every push to the main branch. You can view the pipeline status in the GitHub Actions tab.

## Docker

To run the project in a Docker container, follow these steps:

1. Build the Docker image:
   ```bash
   docker build -t amazon-price-tracker .
   ```

2. Run the container:
   ```bash
   docker run amazon-price-tracker
   ```

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request. Ensure you add tests for new features and keep the code modular.

---

Happy automating! 🛒🤖
