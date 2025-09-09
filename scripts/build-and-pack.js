#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building and packing reNorsk Chrome Extension...\n');

try {
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  if (fs.existsSync('packed')) {
    fs.rmSync('packed', { recursive: true, force: true });
  }

  // Build the extension
  console.log('🔨 Building extension...');
  execSync('npm run build', { stdio: 'inherit' });

  // Create packed directory
  fs.mkdirSync('packed', { recursive: true });

  // Pack the extension
  console.log('📦 Packing extension...');
  execSync('npm run pack', { stdio: 'inherit' });

  console.log('\n✅ Build and pack completed successfully!');
  console.log('📁 Built files are in: dist/');
  console.log('📦 Packed files are in: packed/');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

