import { Redis, RedisOptions } from "ioredis";

export type PickedRedisClient = Pick<Redis, 'set'>

export interface _Redlock {
  withLock<T>(key: string, cb: (...a: unknown[]) => T): Promise<T>
}

export interface ConstructorOptions {
  delay?: number
  timeout?: number
  clientOptions?: RedisOptions
  redisClient?: PickedRedisClient
}