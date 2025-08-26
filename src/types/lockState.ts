/**
 * Enumerado para estados de bloqueio da aplicação
 */
export enum LockState {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED'
}

/**
 * Chave para armazenamento no localStorage
 */
export const LOCK_STATE_STORAGE_KEY = 'app_lock_state';

/**
 * Interface para o estado de bloqueio
 */
export interface LockStateData {
  state: LockState;
  timestamp: number;
  userId?: string;
}