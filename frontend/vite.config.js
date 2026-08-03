import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Prevent Vite from watching binary/locked files in public/
      ignored: ['**/*.pdf', '**/*.docx', '**/*.xlsx', '**/*.png', '**/*.jpg', '**/*.jpeg'],
    },
  },
})
