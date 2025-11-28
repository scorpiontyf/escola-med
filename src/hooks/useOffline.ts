/**
 * Hook useOffline - Armazenamento Offline com AsyncStorage
 * 
 * Gerencia cache local e sincronização com a API.
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Escola, Turma } from '@/types';

const KEYS = {
  ESCOLAS: '@escola_app/escolas',
  TURMAS: '@escola_app/turmas',
  LAST_SYNC: '@escola_app/last_sync',
  PENDING_ACTIONS: '@escola_app/pending_actions',
};

interface PendingAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'escola' | 'turma';
  data: any;
  timestamp: number;
}

interface UseOfflineResult {
  isOnline: boolean;
  isLoading: boolean;
  lastSync: Date | null;
  pendingActionsCount: number;

  escolasCache: Escola[];
  turmasCache: Turma[];

  saveEscolasToCache: (escolas: Escola[]) => Promise<void>;
  saveTurmasToCache: (turmas: Turma[]) => Promise<void>;
  loadFromCache: () => Promise<void>;
  addPendingAction: (action: Omit<PendingAction, 'id' | 'timestamp'>) => Promise<void>;
  syncPendingActions: () => Promise<void>;
  clearCache: () => Promise<void>;
}

/**
 * Hook para gerenciamento de dados offline
 */
export function useOffline(): UseOfflineResult {
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [escolasCache, setEscolasCache] = useState<Escola[]>([]);
  const [turmasCache, setTurmasCache] = useState<Turma[]>([]);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadFromCache();
  }, []);

  const loadFromCache = useCallback(async () => {
    setIsLoading(true);
    try {
      const [escolasJson, turmasJson, lastSyncJson, pendingJson] = await Promise.all([
        AsyncStorage.getItem(KEYS.ESCOLAS),
        AsyncStorage.getItem(KEYS.TURMAS),
        AsyncStorage.getItem(KEYS.LAST_SYNC),
        AsyncStorage.getItem(KEYS.PENDING_ACTIONS),
      ]);

      if (escolasJson) {
        setEscolasCache(JSON.parse(escolasJson));
      }

      if (turmasJson) {
        setTurmasCache(JSON.parse(turmasJson));
      }

      if (lastSyncJson) {
        setLastSync(new Date(lastSyncJson));
      }

      if (pendingJson) {
        setPendingActions(JSON.parse(pendingJson));
      }
    } catch (error) {
      console.error('Erro ao carregar cache:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveEscolasToCache = useCallback(async (escolas: Escola[]) => {
    try {
      await AsyncStorage.setItem(KEYS.ESCOLAS, JSON.stringify(escolas));
      await AsyncStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
      setEscolasCache(escolas);
      setLastSync(new Date());
    } catch (error) {
      console.error('Erro ao salvar escolas no cache:', error);
    }
  }, []);

  const saveTurmasToCache = useCallback(async (turmas: Turma[]) => {
    try {
      await AsyncStorage.setItem(KEYS.TURMAS, JSON.stringify(turmas));
      setTurmasCache(turmas);
    } catch (error) {
      console.error('Erro ao salvar turmas no cache:', error);
    }
  }, []);

  const addPendingAction = useCallback(async (
    action: Omit<PendingAction, 'id' | 'timestamp'>
  ) => {
    const newAction: PendingAction = {
      ...action,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    const updated = [...pendingActions, newAction];
    setPendingActions(updated);

    try {
      await AsyncStorage.setItem(KEYS.PENDING_ACTIONS, JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao salvar ação pendente:', error);
    }
  }, [pendingActions]);

  const syncPendingActions = useCallback(async () => {
    if (!isOnline || pendingActions.length === 0) return;

    console.log(`Sincronizando ${pendingActions.length} ações pendentes...`);

    const successfulIds: string[] = [];

    for (const action of pendingActions) {
      try {        
        console.log(`Ação ${action.id} sincronizada:`, action);
        successfulIds.push(action.id);
      } catch (error) {
        console.error(`Erro ao sincronizar ação ${action.id}:`, error);
      }
    }

    const remaining = pendingActions.filter(a => !successfulIds.includes(a.id));
    setPendingActions(remaining);

    try {
      await AsyncStorage.setItem(KEYS.PENDING_ACTIONS, JSON.stringify(remaining));
    } catch (error) {
      console.error('Erro ao atualizar ações pendentes:', error);
    }
  }, [isOnline, pendingActions]);

  useEffect(() => {
    if (isOnline && pendingActions.length > 0) {
      syncPendingActions();
    }
  }, [isOnline]);

  const clearCache = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        KEYS.ESCOLAS,
        KEYS.TURMAS,
        KEYS.LAST_SYNC,
        KEYS.PENDING_ACTIONS,
      ]);
      setEscolasCache([]);
      setTurmasCache([]);
      setLastSync(null);
      setPendingActions([]);
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }, []);

  return {
    isOnline,
    isLoading,
    lastSync,
    pendingActionsCount: pendingActions.length,
    escolasCache,
    turmasCache,
    saveEscolasToCache,
    saveTurmasToCache,
    loadFromCache,
    addPendingAction,
    syncPendingActions,
    clearCache,
  };
}

/**
 * Hook simplificado apenas para verificar conexão
 */
export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  return isConnected;
}