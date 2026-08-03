import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_API_URL || 'http://localhost:5000';

  return {
    plugins: [react()],
    server: {
      watch: {
        // Prevent Vite from watching binary/locked files in public/
        ignored: ['**/*.pdf', '**/*.docx', '**/*.xlsx', '**/*.png', '**/*.jpg', '**/*.jpeg'],
      },
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: true,
          // Forward cookies properly
          cookieDomainRewrite: 'localhost',
        },
      },
    },
  };
})
