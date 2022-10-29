import redis from "ioredis";
import { ConstructorOptions, PickedRedisClient, _Redlock } from "./types";

class RedLock implements _Redlock {

  static DEFAULT_DELAY = 50;
  static DEFAULT_TIMEOUT = 5000;

  redisClient: PickedRedisClient;
  delay: number
  timeout: number

  constructor({ clientOptions, redisClient, delay, timeout }: ConstructorOptions = {}) {
    if (clientOptions) {
      this.redisClient = new redis (clientOptions);
    } else if (redisClient) {
      this.redisClient = redisClient;
    } else {
      this.redisClient = new redis ();
    }
    this.delay = delay || RedLock.DEFAULT_DELAY;
    this.timeout = timeout || RedLock.DEFAULT_TIMEOUT
  }
  
  async withLock<T>(key: string, cb: (...a: unknown[]) => T): Promise<Awaited<T>> {
    let ok = await this.redisClient.set(key, 1, 'PX', this.timeout, 'NX');
    while (!ok) {
      await new Promise (res => setTimeout(res, this.delay));
      ok = await this.redisClient.set(key, 1, 'PX', this.timeout, 'NX');
    }
    return await cb()
  }

  async disconnect(): Promise<void> {
    return await this.redisClient.disconnect()
  }

}

export default RedLock