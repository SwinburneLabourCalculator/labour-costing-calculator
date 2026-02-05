
// vite.config.ts
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env from .env files (e.g., .env, .env.production)
  // Variables will be available as `env.MY_VAR`
  const env = loadEnv(mode, '.', '')

  return {
    // 👇 IMPORTANT for GitHub Pages:
    // Must match the repository name, with leading and trailing slashes.
    // Your final site URL is:
    // https://swinburnelabourcalculator.github.io/labour-costing-calculator/
    base: '/labour-costing-calculator/',

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    // Expose selected env vars to the client bundle (avoid leaking secrets!)
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  }
})
