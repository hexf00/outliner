import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  // @ts-ignore  换成fork库后不知道为啥这里报错，临时措施是屏蔽
  plugins: [createVuePlugin({
    jsx: true,
  })],
  resolve: {
    alias: {
      '@/': '/src/',
    },
  },
})
