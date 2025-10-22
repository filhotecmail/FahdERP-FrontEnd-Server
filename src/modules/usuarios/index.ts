import type { ModuleDefinition } from '../core/moduleSystem'

// Lazy loading dos componentes
const UserManagementView = () => import('./views/UserManagementView.vue')
const AddUserView = () => import('./views/AddUserView.vue')
const EditUserView = () => import('./views/EditUserView.vue')
const ViewUserView = () => import('./views/ViewUserView.vue')

// Definição do módulo de usuários
export const usuariosModule: ModuleDefinition = {
  name: 'usuarios',

  // Função de instalação do módulo
  install() {
    // Registrar componentes globalmente se necessário
    // app.component('UserManagementView', UserManagementView)

    console.log('Módulo de usuários instalado com sucesso')
  },

  // Componentes do módulo
  components: {
    'gerenciamento-usuarios': UserManagementView,
    'adicionar-usuario': AddUserView,
    'editar-usuario': EditUserView,
    'visualizar-usuario': ViewUserView
  },

  // Rotas do módulo
  routes: [
    {
      path: '/gerenciamento-usuarios',
      name: 'gerenciamento-usuarios',
      component: UserManagementView,
      meta: {
        title: 'Gerenciamento de Usuários'
      }
    },
    {
      path: '/adicionar-usuario',
      name: 'adicionar-usuario',
      component: AddUserView
    },
    {
      path: '/editar-usuario/:id',
      name: 'editar-usuario',
      component: EditUserView,
      meta: {
        title: 'Editar Usuário'
      }
    },
    {
      path: '/visualizar-usuario/:id',
      name: 'visualizar-usuario',
      component: ViewUserView,
      meta: {
        title: 'Visualizar Usuário'
      }
    }
  ],

  // Navegação do módulo (opcional)
  navigation: {
    title: 'Usuários',
    icon: 'account-group',
    items: [
      {
        id: 'gerenciamento-usuarios',
        title: 'Gerenciamento de Usuários',
        component: 'gerenciamento-usuarios',
        icon: 'account-cog'
      },
      {
        id: 'adicionar-usuario',
        title: 'Adicionar Usuário',
        component: 'adicionar-usuario',
        icon: 'account-plus'
      }
    ]
  }
}

export default usuariosModule
