import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,    // ⭐ ล็อกให้ตายตัว
    strictPort: true,   // ⭐ ถ้า 5173 ถูกใช้ → แจ้ง error → ไม่กระโดด!
  }
})