import Redis from 'ioredis';
import RedisMemoryServer from 'redis-memory-server';
import RedLock from '.';

let host: string;
let port: number;
let redisServer: RedisMemoryServer;

beforeEach(async () => {
  redisServer = new RedisMemoryServer();
  host = await redisServer.getHost();
  port = await redisServer.getPort();
});

afterEach(async () => {
  if (redisServer) {
    await redisServer.stop();
  }
});

it('should setup default ioredis client correctly with no clientOptions', async () => {
  const lock = new RedLock ()
  const key = Math.random().toString()
  const value = Math.random()
  await expect(lock.redisClient.set(key, value)).resolves.toEqual("OK")
  await lock.redisClient.disconnect()
});

it('should setup default ioredis client correctly with clientOptions', async () => {
  const lock = new RedLock ({ clientOptions: { port, host } })
  const key = Math.random().toString()
  const value = Math.random()
  await expect(lock.redisClient.set(key, value)).resolves.toEqual("OK")
  await lock.redisClient.disconnect()
});

it('should setup ioredis client correctly', async () => {
  const redisClient = new Redis ({ host, port })
  const lock = new RedLock ({ redisClient })
  const key = Math.random().toString()
  const value = Math.random()
  await expect(lock.redisClient.set(key, value)).resolves.toEqual("OK")
  await lock.redisClient.disconnect()
});

it('should ensure synchronous callback returns correct value', async () => {
  const lock = new RedLock ({ clientOptions: { port, host } })
  const cb = () => 1
  const key = Math.random().toString()
  await expect(lock.withLock(key, cb)).resolves.toEqual(1)
  await lock.redisClient.disconnect()
});

it('should ensure asynchronous callback returns correct value', async () => {
  const lock = new RedLock ({ clientOptions: { port, host } })
  const cb = async () => {
    await new Promise (res => setTimeout(res, 100))
    return 1
  }
  const key = Math.random().toString()
  await expect(lock.withLock(key, cb)).resolves.toEqual(1)
  await lock.redisClient.disconnect()
});