import { defineConfig } from 'vite'
import { crx, defineManifest } from '@crxjs/vite-plugin'
import zipPack from 'vite-plugin-zip-pack'
import manifestFile from './manifest.json'
import path from 'path'
import fs from 'fs'

const manifest = defineManifest(manifestFile)

// Custom plugin to generate CRX file using crx3
function crx3Plugin() {
  return {
    name: 'crx3-plugin',
    apply: 'build',
    writeBundle: {
      sequential: true,
      order: 'post',
      handler: async () => {
        try {
          // Dynamic import for ES module
          const crx3 = (await import('crx3')).default
          
          const inPath = path.resolve('dist')
          const keyPath = path.resolve('extension-key.pem')
          const packedPath = path.resolve('ChromeExtension/v3')
          const crxPath = path.resolve(packedPath, `reNorsk.crx`)
          const zipPath = path.resolve(packedPath, `reNorsk.zip`)
          
          // Check if key file exists, if not, crx3 will generate one
          if (!fs.existsSync(keyPath)) {
            console.log('🔑 No private key found. crx3 will generate one at:', keyPath)
          }
          
          console.log('📦 Generating CRX file with crx3...')
          
          await crx3([inPath], {
            keyPath: keyPath,
            crxPath: crxPath,
            zipPath: zipPath,
          })
          
          console.log('✅ CRX file generated successfully at:', crxPath)
        } catch (error) {
          console.error('❌ Error generating CRX file:', error)
          throw error
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [
    crx({ manifest: manifest }),
    crx3Plugin(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173
    }
  }
})

