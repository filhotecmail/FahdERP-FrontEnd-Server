import type { ModuleDefinition } from '../core/moduleSystem'

const esocialModule: ModuleDefinition = {
  name: 'esocial',
  install() {
    console.log('Módulo eSocial instalado com sucesso')
  },
  components: {
    'esocial-processing': () => import('./views/ESocialProcessingView.vue'),
    'esocial-s1000': () => import('./views/ESocialS1000View.vue'),
    'esocial-s2200': () => import('./views/ESocialS2200View.vue')
  },
  routes: [
    {
      path: '/esocial/processing',
      name: 'esocial-processing',
      component: () => import('./views/ESocialProcessingView.vue'),
      meta: { title: 'eSocial - Processamento e Envio' }
    },
    {
      path: '/esocial/s1000',
      name: 'esocial-s1000',
      component: () => import('./views/ESocialS1000View.vue'),
      meta: { title: 'eSocial - S-1000' }
    },
    {
      path: '/esocial/s2200',
      name: 'esocial-s2200',
      component: () => import('./views/ESocialS2200View.vue'),
      meta: { title: 'eSocial - S-2200' }
    },
  ],
  navigation: {
    title: 'eSocial',
    icon: 'mdi-account-group',
    items: [
      {
        id: 'esocial-processing',
        title: 'Processamento',
        route: '/esocial/processing',
        icon: 'mdi-cog'
      },
      {
        id: 'esocial-s1000',
        title: 'S-1000',
        route: '/esocial/s1000',
        icon: 'mdi-file-document'
      },
      {
        id: 'esocial-s2200',
        title: 'S-2200',
        route: '/esocial/s2200',
        icon: 'mdi-file-document'
      }
    ]
  }
}

export default esocialModule