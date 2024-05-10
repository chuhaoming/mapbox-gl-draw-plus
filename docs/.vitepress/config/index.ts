import { defineConfig } from 'vitepress'
import { shared } from './shared'
import { en } from './en'
import { zh } from './zh'

export default defineConfig({
  ...shared,
  base:'/mapbox-gl-draw-plus/',
  locales: {
    root: { label: 'English', ...en },
    zh: { label: '简体中文', ...zh }
  },
})
