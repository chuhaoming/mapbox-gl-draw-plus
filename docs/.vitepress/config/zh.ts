import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)

export const zh = defineConfig({
  lang: 'zh-Hans',
  description: 'mapbox-gl plugins',

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/zh/guide/': { base: '/zh/guide/', items: sidebarGuide() },
    },

    editLink: {
      pattern: 'https://github.com/chuhaoming/mapbox-gl-draw-plus/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    footer: {
      message: '基于 MIT 许可发布',
      copyright: `版权所有 © 2024-${new Date().getFullYear()} 储浩明`
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '演练场',
      link: '/zh/guide/demo',
      activeMatch: '/zh/guide/'
    }
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    { text: '演练场', link: 'demo' },
    {
      text: '@chmpr/map-draw',
      collapsed: false,
      items: [
        { text: 'API文档', link: 'mapdraw-api' },
      ]
    },
    {
      text: '@chmpr/map-draw-modes',
      collapsed: false,
      items: [
        { text: 'API文档', link: 'map-draw-modes' },
      ]
    },
    {
      text: '@chmpr/operator',
      collapsed: false,
      items: [
        { text: 'API文档', link: 'operator' },
      ]
    },
    {
      text: '@chmpr/map-tips',
      collapsed: false,
      items: [
        { text: 'API文档', link: 'map-tips' },
      ]
    },
    {
      text: '@chmpr/draggable',
      collapsed: false,
      items: [
        { text: 'API文档', link: 'draggable' },
      ]
    },
  ]
}



export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
  zh: {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonText: '搜索文档',
        buttonAriaLabel: '搜索文档'
      },
      modal: {
        searchBox: {
          resetButtonTitle: '清除查询条件',
          resetButtonAriaLabel: '清除查询条件',
          cancelButtonText: '取消',
          cancelButtonAriaLabel: '取消'
        },
        startScreen: {
          recentSearchesTitle: '搜索历史',
          noRecentSearchesText: '没有搜索历史',
          saveRecentSearchButtonTitle: '保存至搜索历史',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          favoriteSearchesTitle: '收藏',
          removeFavoriteSearchButtonTitle: '从收藏中移除'
        },
        errorScreen: {
          titleText: '无法获取结果',
          helpText: '你可能需要检查你的网络连接'
        },
        footer: {
          selectText: '选择',
          navigateText: '切换',
          closeText: '关闭',
          searchByText: '搜索提供者'
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          suggestedQueryText: '你可以尝试查询',
          reportMissingResultsText: '你认为该查询应该有结果？',
          reportMissingResultsLinkText: '点击反馈'
        }
      }
    }
  }
}
