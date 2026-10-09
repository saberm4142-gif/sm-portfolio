import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// base './' lets the build work on any GitHub Pages path (user site or project site)
export default defineConfig({ base: './', plugins: [react()] })
