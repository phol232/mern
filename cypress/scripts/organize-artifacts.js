#!/usr/bin/env node

/**
 * Script to organize Cypress artifacts (screenshots, videos, reports) by date
 * This helps keep the artifacts folder organized and makes it easier to find test results
 */

const fs = require('fs');
const path = require('path');

// Get current date in YYYY-MM-DD format
const getDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get timestamp for unique folder names
const getTimestamp = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}-${minutes}-${seconds}`;
};

// Create directory if it doesn't exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Move files from source to destination
const moveFiles = (sourceDir, destDir) => {
  if (!fs.existsSync(sourceDir)) {
    return 0;
  }

  const files = fs.readdirSync(sourceDir);
  let movedCount = 0;

  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);

    // Skip if it's a directory or already organized
    if (fs.statSync(sourcePath).isDirectory()) {
      return;
    }

    try {
      fs.renameSync(sourcePath, destPath);
      movedCount++;
    } catch (error) {
      console.error(`Error moving ${file}:`, error.message);
    }
  });

  return movedCount;
};

// Main organization function
const organizeArtifacts = () => {
  const cypressDir = path.join(__dirname, '..');
  const dateString = getDateString();
  const timestamp = getTimestamp();
  const runId = `${dateString}_${timestamp}`;

  console.log(`\n📁 Organizing Cypress artifacts for run: ${runId}\n`);

  // Create organized structure
  const artifactsDir = path.join(cypressDir, 'artifacts', dateString, runId);
  ensureDir(artifactsDir);

  // Organize screenshots
  const screenshotsSource = path.join(cypressDir, 'screenshots');
  const screenshotsDest = path.join(artifactsDir, 'screenshots');
  ensureDir(screenshotsDest);
  const screenshotsMoved = moveFiles(screenshotsSource, screenshotsDest);
  console.log(`📸 Screenshots: ${screenshotsMoved} files organized`);

  // Organize videos
  const videosSource = path.join(cypressDir, 'videos');
  const videosDest = path.join(artifactsDir, 'videos');
  ensureDir(videosDest);
  const videosMoved = moveFiles(videosSource, videosDest);
  console.log(`🎥 Videos: ${videosMoved} files organized`);

  // Organize reports
  const reportsSource = path.join(cypressDir, 'reports');
  const reportsDest = path.join(artifactsDir, 'reports');
  ensureDir(reportsDest);
  const reportsMoved = moveFiles(reportsSource, reportsDest);
  console.log(`📊 Reports: ${reportsMoved} files organized`);

  // Create a summary file
  const summary = {
    runId,
    date: dateString,
    timestamp,
    artifacts: {
      screenshots: screenshotsMoved,
      videos: videosMoved,
      reports: reportsMoved
    },
    location: artifactsDir
  };

  const summaryPath = path.join(artifactsDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log(`\n✅ Artifacts organized in: ${artifactsDir}`);
  console.log(`📄 Summary saved to: ${summaryPath}\n`);

  return artifactsDir;
};

// Cleanup old artifacts (older than specified days)
const cleanupOldArtifacts = (daysToKeep = 7) => {
  const cypressDir = path.join(__dirname, '..');
  const artifactsDir = path.join(cypressDir, 'artifacts');

  if (!fs.existsSync(artifactsDir)) {
    console.log('No artifacts directory found. Nothing to clean up.');
    return;
  }

  const now = Date.now();
  const maxAge = daysToKeep * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  let deletedCount = 0;

  console.log(`\n🧹 Cleaning up artifacts older than ${daysToKeep} days...\n`);

  // Iterate through date folders
  const dateFolders = fs.readdirSync(artifactsDir);
  
  dateFolders.forEach(dateFolder => {
    const datePath = path.join(artifactsDir, dateFolder);
    
    if (!fs.statSync(datePath).isDirectory()) {
      return;
    }

    const runFolders = fs.readdirSync(datePath);
    
    runFolders.forEach(runFolder => {
      const runPath = path.join(datePath, runFolder);
      
      if (!fs.statSync(runPath).isDirectory()) {
        return;
      }

      const stats = fs.statSync(runPath);
      const age = now - stats.mtimeMs;

      if (age > maxAge) {
        try {
          fs.rmSync(runPath, { recursive: true, force: true });
          deletedCount++;
          console.log(`🗑️  Deleted: ${dateFolder}/${runFolder}`);
        } catch (error) {
          console.error(`Error deleting ${runPath}:`, error.message);
        }
      }
    });

    // Remove empty date folders
    if (fs.readdirSync(datePath).length === 0) {
      fs.rmdirSync(datePath);
      console.log(`🗑️  Removed empty folder: ${dateFolder}`);
    }
  });

  console.log(`\n✅ Cleanup complete. Deleted ${deletedCount} old artifact folders.\n`);
};

// CLI interface
const args = process.argv.slice(2);
const command = args[0];

if (command === 'cleanup') {
  const days = parseInt(args[1]) || 7;
  cleanupOldArtifacts(days);
} else if (command === 'organize') {
  organizeArtifacts();
} else {
  console.log(`
Cypress Artifacts Organizer

Usage:
  node organize-artifacts.js organize          Organize current artifacts by date
  node organize-artifacts.js cleanup [days]    Clean up artifacts older than [days] (default: 7)

Examples:
  node organize-artifacts.js organize
  node organize-artifacts.js cleanup 14
  `);
}
