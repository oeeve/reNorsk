# reNorsk Chrome Extension - Development Guide

This Chrome extension converts Norwegian Nynorsk text to Bokmål using the Apertium translation API.

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

### Development Commands

#### Development Mode (with Hot Reload)
```bash
npm run dev
```
This starts the Vite development server with hot module replacement. The extension will automatically reload when you make changes to the source code.

#### Build for Production
```bash
npm run build
```
Creates an optimized build in the `dist/` directory.

#### Pack Extension
```bash
npm run pack
```
Builds the extension and creates a packaged .zip file ready for Chrome Web Store upload.

### Loading the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `dist/` folder (after running `npm run build`)

For development with hot reload:
1. Run `npm run dev`
2. Load the `dist/` folder as an unpacked extension
3. Changes will automatically reload the extension

### Project Structure

```
src/
├── background.js      # Service worker (background script)
├── manifest.json      # Extension manifest
└── images/           # Extension icons
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    ├── icon64.png
    └── icon128.png

dist/                 # Build output (generated)
packed/              # Packaged extensions (generated)
```

### Build System

This project uses:
- **Vite**: Fast build tool with hot module replacement
- **CRXJS**: Vite plugin specifically for Chrome extensions
- **web-ext**: Mozilla's tool for packaging web extensions

### Features

- 🔥 Hot Module Replacement during development
- 📦 Automatic extension packaging
- 🚀 Fast builds with Vite
- 🛠️ Modern JavaScript tooling
- 📱 Manifest V3 support

### Debugging

1. Open Chrome DevTools
2. Go to the Extensions tab
3. Find your extension and click "Inspect views: service worker" for background script debugging
4. Use console.log statements in your code - they'll appear in the DevTools console

### Translation API

The extension uses the Apertium API for translation:
- Endpoint: `https://www.apertium.org/apy/translate`
- Language pair: `nno|nob` (Nynorsk to Bokmål)
- Rate limiting: Built-in throttling to respect API limits

