/**
 * Adapter Pattern
 *
 * Adapta diferentes fontes de armazenamento para uma interface comum.
 * Permite usar AsyncStorage, MMKV, ou qualquer outro storage.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Interface comum para qualquer storage
 */
export interface IStorageAdapter {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

/**
 * Adapter para AsyncStorage do React Native
 */
export class AsyncStorageAdapter implements IStorageAdapter {
  private prefix: string;

  constructor(prefix: string = "escola_app_") {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(this.getKey(key));
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("AsyncStorage getItem error:", error);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error("AsyncStorage setItem error:", error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error("AsyncStorage removeItem error:", error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error("AsyncStorage clear error:", error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys.filter((key) => key.startsWith(this.prefix));
    } catch (error) {
      console.error("AsyncStorage getAllKeys error:", error);
      return [];
    }
  }
}

/**
 * Adapter em memória para testes
 */
export class MemoryStorageAdapter implements IStorageAdapter {
  private storage: Map<string, string> = new Map();

  async getItem<T>(key: string): Promise<T | null> {
    const value = this.storage.get(key);
    return value ? JSON.parse(value) : null;
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    this.storage.set(key, JSON.stringify(value));
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  async getAllKeys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }
}

interface CacheItem<T> {
  value: T;
  expiry: number;
}

/**
 * Adapter com cache e expiração
 */
export class CacheStorageAdapter implements IStorageAdapter {
  private baseAdapter: IStorageAdapter;
  private defaultTTL: number; // em milissegundos

  constructor(
    baseAdapter: IStorageAdapter,
    defaultTTL: number = 5 * 60 * 1000,
  ) {
    this.baseAdapter = baseAdapter;
    this.defaultTTL = defaultTTL;
  }

  async getItem<T>(key: string): Promise<T | null> {
    const cached = await this.baseAdapter.getItem<CacheItem<T>>(key);

    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      await this.removeItem(key);
      return null;
    }

    return cached.value;
  }

  async setItem<T>(key: string, value: T, ttl?: number): Promise<void> {
    const cacheItem: CacheItem<T> = {
      value,
      expiry: Date.now() + (ttl || this.defaultTTL),
    };
    await this.baseAdapter.setItem(key, cacheItem);
  }

  async removeItem(key: string): Promise<void> {
    await this.baseAdapter.removeItem(key);
  }

  async clear(): Promise<void> {
    await this.baseAdapter.clear();
  }

  async getAllKeys(): Promise<string[]> {
    return this.baseAdapter.getAllKeys();
  }
}

/**
 * Chaves de armazenamento
 */
export const STORAGE_KEYS = {
  ESCOLAS: "escolas",
  TURMAS: "turmas",
  ULTIMA_SINCRONIZACAO: "ultima_sincronizacao",
  PREFERENCIAS: "preferencias",
} as const;

/**
 * Service de armazenamento offline
 */
export class OfflineStorageService {
  private storage: IStorageAdapter;

  constructor(storage: IStorageAdapter) {
    this.storage = storage;
  }

  async salvarEscolas(escolas: any[]): Promise<void> {
    await this.storage.setItem(STORAGE_KEYS.ESCOLAS, escolas);
    await this.storage.setItem(
      STORAGE_KEYS.ULTIMA_SINCRONIZACAO,
      new Date().toISOString(),
    );
  }

  async carregarEscolas(): Promise<any[] | null> {
    return this.storage.getItem(STORAGE_KEYS.ESCOLAS);
  }

  async salvarTurmas(turmas: any[]): Promise<void> {
    await this.storage.setItem(STORAGE_KEYS.TURMAS, turmas);
  }

  async carregarTurmas(): Promise<any[] | null> {
    return this.storage.getItem(STORAGE_KEYS.TURMAS);
  }

  async getUltimaSincronizacao(): Promise<string | null> {
    return this.storage.getItem(STORAGE_KEYS.ULTIMA_SINCRONIZACAO);
  }

  async limparDados(): Promise<void> {
    await this.storage.clear();
  }
}

let storageService: OfflineStorageService | null = null;

export function getStorageService(): OfflineStorageService {
  if (!storageService) {
    const adapter = new AsyncStorageAdapter();
    storageService = new OfflineStorageService(adapter);
  }
  return storageService;
}

export function createTestStorageService(): OfflineStorageService {
  return new OfflineStorageService(new MemoryStorageAdapter());
}
