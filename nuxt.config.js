export default {
  target: 'static',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  NETWORK: 'wax',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Immersys Companion App',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', href: '/logos/favicon-immersys-32x32.png' },
      { rel: 'icon', href: '/logos/favicon-immersys-192x192.png' },
      { rel: 'apple-touch-icon', href: '/logos/favicon-immersys-180x180.png' },  
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/global',
    { src: '~/plugins/startapp', mode: 'client' },
    { src: '~/plugins/notifications-ssr', ssr: true },
    { src: '~/plugins/notifications-client', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    ['@nuxtjs/fontawesome', {
      component: 'fa',
      suffix: true,
      icons: { // if you have bought the Pro packages
        // list the icons you want to add, not listed icons will be tree-shaked
        solid: [
          'faXmark',
          'faPlus',
          'faMinus',
          'faRightFromBracket',
        ]
      }
    }]
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
