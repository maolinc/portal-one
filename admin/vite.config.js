import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 管理端构建产物由 server 挂在 /admin 路径下，故 base 必须一致
export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
    },
  },
})
