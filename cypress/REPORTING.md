# Cypress Reporting and Artifact Management

This document describes the reporting and artifact management system for Cypress E2E tests in the CRÍTICO MERN project.

## Overview

The reporting system automatically generates HTML reports with embedded screenshots, organizes artifacts by date, and provides tools for cleanup and maintenance.

## Features

### 1. Mochawesome Reporter

**Configuration:** `cypress.config.ts`

The Mochawesome reporter generates beautiful HTML reports with:
- Test execution summary with pass/fail statistics
- Interactive charts and graphs
- Embedded screenshots from failed tests
- Detailed test case information
- Execution time metrics
- Organized by status (pass/fail) and timestamp

**Report Location:** `cypress/reports/`

**Report Format:** `[status]_[datetime]-report.html`

Example: `pass_November_11_2025-report.html`

### 2. Screenshot Capture

**Configuration:** `cypress.config.ts`

Screenshots are automatically captured when tests fail:
- **Trigger:** Automatic on test failure
- **Location:** `cypress/screenshots/`
- **Format:** PNG
- **Embedded:** Screenshots are embedded in HTML reports

### 3. Video Recording

**Configuration:** `cypress.config.ts`

Videos record the entire test execution:
- **CI Mode:** Enabled (videos recorded)
- **Development Mode:** Disabled (saves disk space)
- **Location:** `cypress/videos/`
- **Format:** MP4
- **Compression:** Level 32 (balanced quality/size)

To enable videos locally, set environment variable:
```bash
CI=true npm run cypress:run
```

### 4. Artifact Organization

**Script:** `cypress/scripts/organize-artifacts.js`

Organizes artifacts into a date-based folder structure:

```
cypress/artifacts/
└── 2025-11-11/                        # Date
    └── 2025-11-11_14-30-45/          # Timestamp
        ├── screenshots/               # Test failure screenshots
        ├── videos/                    # Test execution videos
        ├── reports/                   # HTML and JSON reports
        └── summary.json              # Execution summary
```

**Summary File Format:**
```json
{
  "runId": "2025-11-11_14-30-45",
  "date": "2025-11-11",
  "timestamp": "14-30-45",
  "artifacts": {
    "screenshots": 5,
    "videos": 12,
    "reports": 18
  },
  "location": "/path/to/artifacts/2025-11-11/2025-11-11_14-30-45"
}
```

### 5. Automatic Cleanup

**Script:** `cypress/scripts/organize-artifacts.js cleanup`

Automatically removes old artifacts to save disk space:
- **Default:** Removes artifacts older than 7 days
- **Configurable:** Can specify custom retention period
- **Safe:** Only removes organized artifacts, not current runs

## Usage

### Running Tests with Reports

```bash
# Run tests (reports generated automatically)
npm run cypress:run

# Run tests and organize artifacts
npm run cypress:run:organized
```

### Generating Consolidated Reports

```bash
# Merge all JSON reports and generate HTML
npm run cypress:report

# Generate and open report in browser (macOS)
npm run cypress:report:open
```

### Organizing Artifacts

```bash
# Organize current artifacts by date
npm run cypress:organize

# This moves files from:
#   cypress/screenshots/ → cypress/artifacts/YYYY-MM-DD/YYYY-MM-DD_HH-MM-SS/screenshots/
#   cypress/videos/      → cypress/artifacts/YYYY-MM-DD/YYYY-MM-DD_HH-MM-SS/videos/
#   cypress/reports/     → cypress/artifacts/YYYY-MM-DD/YYYY-MM-DD_HH-MM-SS/reports/
```

### Cleaning Up Artifacts

```bash
# Remove artifacts older than 7 days
npm run cypress:clean:old

# Remove ALL artifacts (screenshots, videos, reports)
npm run cypress:clean
```

### Manual Script Usage

```bash
# Organize artifacts
node cypress/scripts/organize-artifacts.js organize

# Cleanup old artifacts (default: 7 days)
node cypress/scripts/organize-artifacts.js cleanup

# Cleanup with custom retention (e.g., 14 days)
node cypress/scripts/organize-artifacts.js cleanup 14
```

## Best Practices

### 1. Regular Cleanup

Run cleanup regularly to avoid filling up disk space:
```bash
# Add to CI/CD pipeline or run weekly
npm run cypress:clean:old
```

### 2. Organize After Test Runs

For important test runs, organize artifacts immediately:
```bash
npm run cypress:run:organized
```

### 3. Review Failed Test Screenshots

Screenshots are embedded in reports, but you can also find them in:
- Current run: `cypress/screenshots/`
- Organized: `cypress/artifacts/YYYY-MM-DD/YYYY-MM-DD_HH-MM-SS/screenshots/`

### 4. Share Reports

HTML reports are self-contained and can be shared:
```bash
# Find the latest report
ls -lt cypress/reports/*.html | head -1

# Or in organized artifacts
ls -lt cypress/artifacts/*/*/reports/*.html | head -1
```

### 5. CI/CD Integration

In CI/CD pipelines:
1. Tests run automatically
2. Videos are recorded (CI=true)
3. Reports are generated
4. Artifacts are uploaded as build artifacts
5. Old artifacts are cleaned up

Example GitHub Actions:
```yaml
- name: Run Cypress tests
  run: npm run cypress:run
  
- name: Generate report
  if: always()
  run: npm run cypress:report
  
- name: Upload artifacts
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: cypress-artifacts
    path: |
      cypress/screenshots/
      cypress/videos/
      cypress/reports/
```

## Configuration Reference

### cypress.config.ts

```typescript
{
  // Screenshots
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/screenshots',
  
  // Videos
  video: process.env.CI ? true : false,
  videoCompression: 32,
  videosFolder: 'cypress/videos',
  
  // Reporter
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    charts: true,
    reportPageTitle: 'CRÍTICO E2E Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    reportFilename: '[status]_[datetime]-report',
    timestamp: 'longDate',
  }
}
```

### package.json Scripts

```json
{
  "scripts": {
    "cypress:run": "cypress run",
    "cypress:run:organized": "cypress run && npm run cypress:organize",
    "cypress:report": "npx mochawesome-merge ... && npx marge ...",
    "cypress:report:open": "npm run cypress:report && open ...",
    "cypress:organize": "node cypress/scripts/organize-artifacts.js organize",
    "cypress:clean": "rm -rf cypress/screenshots cypress/videos ...",
    "cypress:clean:old": "node cypress/scripts/organize-artifacts.js cleanup 7"
  }
}
```

## Troubleshooting

### Reports not generating

1. Check that mochawesome dependencies are installed:
   ```bash
   npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
   ```

2. Verify reporter configuration in `cypress.config.ts`

3. Check for errors in test output

### Videos not recording

1. **In development:** This is expected. Videos are disabled locally.
2. **In CI:** Set `CI=true` environment variable
3. **Force enable:** Modify `cypress.config.ts` to `video: true`

### Organize script fails

1. Check Node.js version (requires Node 14+)
2. Verify file permissions
3. Check disk space
4. Review error messages in console

### Cleanup removes too much

The cleanup script only removes artifacts in the `cypress/artifacts/` folder that are older than the specified days. Current test runs in `cypress/screenshots/`, `cypress/videos/`, and `cypress/reports/` are never touched by cleanup.

## Metrics and Analytics

### Report Metrics

Each report includes:
- Total tests executed
- Pass/fail count and percentage
- Test duration (individual and total)
- Suite execution time
- Failure details with stack traces

### Artifact Metrics

The `summary.json` file tracks:
- Number of screenshots captured
- Number of videos recorded
- Number of report files generated
- Execution timestamp
- Artifact location

### Disk Space Management

Monitor disk usage:
```bash
# Check artifacts folder size
du -sh cypress/artifacts/

# Count artifact folders
find cypress/artifacts -type d -name "*_*" | wc -l

# List largest artifacts
du -sh cypress/artifacts/*/* | sort -rh | head -10
```

## Future Enhancements

Potential improvements:
- [ ] Automatic upload to cloud storage (S3, Azure Blob)
- [ ] Integration with test management tools (TestRail, Zephyr)
- [ ] Slack/email notifications with report links
- [ ] Trend analysis across multiple runs
- [ ] Performance metrics tracking
- [ ] Custom report templates
- [ ] Parallel execution support with merged reports

## Resources

- [Mochawesome Documentation](https://github.com/adamgruber/mochawesome)
- [Cypress Screenshots](https://docs.cypress.io/guides/references/configuration#Screenshots)
- [Cypress Videos](https://docs.cypress.io/guides/references/configuration#Videos)
- [Cypress Reporters](https://docs.cypress.io/guides/tooling/reporters)
