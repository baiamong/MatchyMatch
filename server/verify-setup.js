#!/usr/bin/env node

/**
 * Setup verification script for MatchyMatch backend
 * Checks that all required files and configurations are in place
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const checks = [
  { name: 'Server package.json', path: 'package.json' },
  { name: 'Docker Compose', path: 'docker-compose.yml' },
  { name: 'Environment example', path: '.env.example' },
  { name: 'Migration config', path: '.migration.json' },
  { name: 'App entry', path: 'src/app.js' },
  { name: 'Server entry', path: 'src/server.js' },
  { name: 'Database config', path: 'src/config/database.js' },
  { name: 'Environment config', path: 'src/config/env.js' },
  { name: 'Constants', path: 'src/config/constants.js' },
  { name: 'Auth middleware', path: 'src/middleware/auth.js' },
  { name: 'Error handler', path: 'src/middleware/errorHandler.js' },
  { name: 'Migration 001', path: 'migrations/001_create_users.sql' },
  { name: 'Migration 002', path: 'migrations/002_create_puzzles.sql' },
  { name: 'Migration 003', path: 'migrations/003_create_matches.sql' },
  { name: 'Migration 004', path: 'migrations/004_create_leaderboard_view.sql' },
  { name: 'Migration 005', path: 'migrations/005_seed_puzzles.sql' },
];

console.log('🔍 Verifying MatchyMatch backend setup...\n');

let allPassed = true;

for (const check of checks) {
  const fullPath = join(__dirname, check.path);
  const exists = existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${check.name}`);
  if (!exists) allPassed = false;
}

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('✅ All checks passed!');
  console.log('\nNext steps:');
  console.log('1. Copy .env.example to .env and configure');
  console.log('2. Start PostgreSQL: docker-compose up -d');
  console.log('3. Install dependencies: npm install');
  console.log('4. Run migrations: npm run migrate:up');
  console.log('5. Start server: npm run dev');
} else {
  console.log('❌ Some files are missing. Please check the setup.');
  process.exit(1);
}
