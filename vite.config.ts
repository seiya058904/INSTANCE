import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/INSTANCE/' : '/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
}))
