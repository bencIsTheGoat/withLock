import { Redis, RedisOptions } from "ioredis";

export type PickedRedisClient = Pick<Redis, 'set' | 'disconnect'>

export interface _Redlock {
  withLock<T>(key: string, cb: (...a: unknown[]) => T): Promise<T>
  disconnect(): Promise<void>
}

export interface ConstructorOptions {
  delay?: number
  timeout?: number
  clientOptions?: RedisOptions
  redisClient?: PickedRedisClient
}