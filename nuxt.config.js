import colors from 'vuetify/es5/util/colors'

// @ts-ignore
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - 归家行动客户端',
    title: '归家行动',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, user-scalable=no',
      },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        type: 'text/javascript',
        // 引入高德地图 JavaScript API：https://developer.amap.com/api/jsapi-v2/guide/abc/load
        // key 对应 process.env.mapAppJSAPIKey
        // plugin 包括 AMap.Geolocation, AMap.Geocoder 插件
        src:
          'https://webapi.amap.com/maps?v=2.0&key=468030a5057ce8e44979e11e3c353d23&plugin=AMap.Geolocation,AMap.Geocoder',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['github-markdown-css', '~/assets/content'],

  // The env Property: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-env
  env: {
    // 归家行动后端地址
    HOME_ACTION_BACKEND_URL: 'http://localhost:12323',
    // 获取高德地图应用名称，key 名称与 key：https://console.amap.com/dev/key/app
    // mapAppName: '归家行动',
    // mapAppJSAPIKeyName: '归家行动客户端',
    mapAppJSAPIKey: '468030a5057ce8e44979e11e3c353d23',
    // 飞书应用 App ID 和 App Secret
    feishuAppId: 'cli_a0fac4db75389014',
    feishuAppSecret: 'tmnT6Fy8TeTsql76yS45Od4vq7tFARvd',
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/AMapGeolocation.js',
    '~/plugins/Day.js',
    '~/plugins/EventBus.js',
    '~/plugins/Main.js',
    '~/plugins/ValueHandler.js',
    '~/plugins/VueClipboard.js',
    '~/plugins/Axios.js',
    '~/plugins/NProgress.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://github.com/nuxt-community/proxy-modules
    '@nuxtjs/proxy',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
    credentials: true,
  },

  proxy: {
    // this.$axios.post('/api/relative/getInfo') 相当于 this.$axios.post('http://localhost:3000/relative/getInfo')
    '/api/': {
      target: 'http://47.98.154.166:3000',
      changeOrigin: true,
      ws: true,
      pathRewrite: { '^/api/': '' },
    },
    '/feishuapi/': {
      target: 'https://open.feishu.cn/open-apis',
      changeOrigin: true,
      ws: true,
      pathRewrite: { '^/feishuapi/': '' },
    },
  },

  router: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'zh',
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          // primary 颜色须同步修改 ~/assets/content.scss 中的定义
          primary: '#D32F2F', // red darken-2
          primaryAccount: '#546E7A', // blue-grey darken-1
          primaryConvener: '#1976D2', // blue darken-2
          primaryMission: '#00897B', // teal darken-1
          relativeColor: '#ffa653',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        dark: {
          primary: '#D32F2F',
          primaryAccount: '#546E7A',
          primaryConvener: '#1976D2',
          primaryMission: '#00897B',
          relativeColor: '#ffa653',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: ['axios'],
  },
}
