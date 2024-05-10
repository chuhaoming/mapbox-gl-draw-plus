import { defineConfig } from 'vitepress'
import { search as zhSearch } from './zh'

export const shared = defineConfig({
  title: 'Mapbox-gl-draw-plus',

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  markdown: {
    math: true,
    codeTransformers: [
      // We use `[!!code` in demo to prevent transformation, here we revert it back.
      {
        postprocess(code) {
          return code.replace(/\[\!\!code/g, '[!code')
        }
      }
    ]
  },

  // sitemap: {
  //   hostname: 'https://vitepress.dev',
  //   transformItems(items) {
  //     return items.filter((item) => !item.url.includes('migration'))
  //   }
  // },

  /* prettier-ignore */
  head: [
    // ['link', { rel: 'icon', type: 'image/svg+xml', href: '/vitepress-logo-mini.svg' }],
    // ['link', { rel: 'icon', type: 'image/png', href: '/vitepress-logo-mini.png' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
  ],

  themeConfig: {
    logo: { src: '/map.png', width: 24, height: 24 },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/chuhaoming/mapbox-gl-draw-plus' }
    ],

    search: {
      provider: 'local',
      options: {
        locales: { ...zhSearch}
      }
    },
  }
})
