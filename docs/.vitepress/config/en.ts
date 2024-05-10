import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)

export const en = defineConfig({
  lang: 'en-US',
  description: 'mapbox-gl plugins',

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/guide/': { base: '/guide/', items: sidebarGuide() },
    },

    editLink: {
      pattern: 'https://github.com/chuhaoming/mapbox-gl-draw-plus/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present hao ming chu'
    }
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Example',
      link: '/guide/demo',
      activeMatch: '/guide/'
    }
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Example', link: 'demo' },
    {
      text: '@chmpr/map-draw',
      collapsed: false,
      items: [
        { text: 'API doc', link: 'mapdraw-api' },
      ]
    },
    {
      text: '@chmpr/map-draw-modes',
      collapsed: false,
      items: [
        { text: 'API doc', link: 'map-draw-modes' },
      ]
    },
    {
      text: '@chmpr/operator',
      collapsed: false,
      items: [
        { text: 'API doc', link: 'operator' },
      ]
    },
    {
      text: '@chmpr/map-tips',
      collapsed: false,
      items: [
        { text: 'API doc', link: 'map-tips' },
      ]
    },
    {
      text: '@chmpr/draggable',
      collapsed: false,
      items: [
        { text: 'API doc', link: 'draggable' },
      ]
    },
  ]
}


