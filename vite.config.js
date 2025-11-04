import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// Optional HTTPS dev server support. To enable locally create certificates (recommended with mkcert)
// and place them at ./certs/localhost.pem and ./certs/localhost-key.pem OR set
// VITE_DEV_SSL_CERT and VITE_DEV_SSL_KEY environment variables pointing to your cert/key files.
function getHttpsConfig() {
  const certPath = process.env.VITE_DEV_SSL_CERT || path.resolve(__dirname, 'certs', 'localhost.pem')
  const keyPath = process.env.VITE_DEV_SSL_KEY || path.resolve(__dirname, 'certs', 'localhost-key.pem')
  try {
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      return {
        cert: fs.readFileSync(certPath),
        key: fs.readFileSync(keyPath)
      }
    }
  } catch (e) {
    // ignore and fall through to disabled https
  }
  return false
}

const httpsCfg = getHttpsConfig()

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: httpsCfg ? { https: httpsCfg } : undefined
})

