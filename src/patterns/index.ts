export {
  type IRepository,
  type IEscolaRepository,
  type ITurmaRepository,
  EscolaApiRepository,
  TurmaApiRepository,
  getEscolaRepository,
  getTurmaRepository,
} from './repository';

export {
  EscolaFactory,
  TurmaFactory,
  getEscolaFactory,
  getTurmaFactory,
} from './factory';

export {
  type IStorageAdapter,
  AsyncStorageAdapter,
  MemoryStorageAdapter,
  CacheStorageAdapter,
  OfflineStorageService,
  getStorageService,
  createTestStorageService,
  STORAGE_KEYS,
} from './adapter';