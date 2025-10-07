import 'vue-router'
import type { RBACAuthConfig, RBACPermissionResponse } from '@/composables/useRBACAuth'
import type { Component } from 'vue'

// Estender as interfaces do Vue Router para incluir RBAC
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    rbac_auth?: RBACAuthConfig
    rbacPermissions?: RBACPermissionResponse
  }

  interface RouteRecordNormalized {
    rbac_auth?: RBACAuthConfig
  }
}

// Interface personalizada para rotas com RBAC
export interface RBACRouteRecord {
  path: string
  name?: string
  component?: Component | (() => Promise<Component>)
  rbac_auth?: RBACAuthConfig
  meta?: {
    title?: string
    requiresAuth?: boolean
    rbac_auth?: RBACAuthConfig
    rbacPermissions?: RBACPermissionResponse
  }
  children?: RBACRouteRecord[]
}

// Tipos auxiliares para verificação de permissões
export type PermissionAction = 'view' | 'update' | 'insert' | 'delete'

export interface PermissionCheck {
  hasPermission: boolean
  permissions?: RBACPermissionResponse
  error?: string
}