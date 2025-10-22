import type { ModuleDefinition } from '../core/moduleSystem'

// Lazy loading dos componentes
const ManagementView = () => import('./views/DefaultTemplateMannager.vue')
const AddviewView = () => import('./views/DefaultTemplateAddView.vue')
const EditView = () => import('./views/DefaultTemplateEdit.vue')

// Definição do módulo de template
export const templateModule: ModuleDefinition = {
  name: 'template',

  // Função de instalação do módulo
  install() {
    // Registrar componentes globalmente se necessário
    // app.component('TemplateManagementView', TemplateManagementView)

    console.log('Módulo de template instalado com sucesso')
  },

  // Componentes do módulo
  components: {
    'gerenciamento-template': ManagementView,
    'adicionar-template': AddviewView,
    'editar-template': EditView
  },

  // Rotas do módulo
  routes: [
    {
      path: '/gerenciamento-template',
      name: 'gerenciamento-template',
      component: ManagementView,
      meta: {
        title: 'Gerenciamento de Templates'
      }
    },
    {
      path: '/adicionar-template',
      name: 'adicionar-template',
      component: AddviewView,
      meta: {
        title: 'Adicionar Template'
      }
    },
    {
      path: '/editar-template/:id',
      name: 'editar-template',
      component: EditView,
      meta: {
        title: 'Editar Template'
      }
    }
  ],

  // Navegação do módulo (opcional)
  navigation: {
    title: 'Templates',
    icon: 'file-document-multiple',
    items: [
      {
        id: 'gerenciamento-template',
        title: 'Gerenciamento de Templates',
        component: 'gerenciamento-template',
        icon: 'file-document-edit'
      },
      {
        id: 'adicionar-template',
        title: 'Adicionar Template',
        component: 'adicionar-template',
        icon: 'file-document-plus'
      }
    ]
  }
}

export default templateModule
