# GitHub Actions CI/CD Pipeline Configuration

This file documents the recommended CI/CD pipeline setup for this project.

## Setup Instructions

To enable the CI/CD pipeline, create a file at `.github/workflows/ci.yml` with the following content:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test -- --coverage
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 5
```

## Pipeline Jobs

### 1. Lint Job
- Runs ESLint on all code
- Ensures code quality and consistency
- Fails if linting errors are found

### 2. Test Job
- Runs Jest test suite
- Generates coverage reports
- Uploads coverage to Codecov
- Fails if tests don't pass

### 3. Build Job
- Runs Vite build process
- Uploads build artifacts for 5 days
- Fails if build fails

## Running Locally

Before pushing, you can run these checks locally:

```bash
# Lint
npm run lint

# Test
npm run test

# Build
npm run build
```

## Notes

- The pipeline runs on push to `main` and `develop` branches
- The pipeline also runs on pull requests to these branches
- Node.js version 18 is used
- npm dependencies are cached for faster builds
