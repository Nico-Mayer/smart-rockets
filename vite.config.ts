import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        target: 'esnext',
    },
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer({})],
        },
    },
})
