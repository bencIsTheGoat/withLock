# withLock

A simple and convienient wrapper for Redlock, written in TypeScript.

---

### Installation
```
npm i withLock
```
---
### Import
```
import Redlock from 'withLock';
```
---
### Initialization
See initialzation options below
```
interface ConstructorOptions {
  delay?: number
  timeout?: number
  clientOptions?: RedisOptions
  redisClient?: PickedRedisClient
}
```


#### Example #1 - Use default redis client (ioredis) and local redis instance.
```
const lock = new Redlock ()
```

Example #2 - Use default redis client (ioredis) and specify client options.
```
const clientOptions = {
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  username: "default", // needs Redis >= 6
  password: "my-top-secret",
  db: 0, // Defaults to 0
};
const lock = new Redlock ({ clientOptions })
```

Example #3 - Pass in your own redis client, prefereably ioredis, but not required.
NOTE: This redis client must satisfy the type of ioredis's `set` method.
```
import redis from 'ioredis';

const redisClient = new redis ({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  username: "default", // needs Redis >= 6
  password: "my-top-secret",
  db: 0, // Defaults to 0
});

const lock = new Redlock ({ redisClient })
```
---
### Usage
Example #1 - Synchronous callback
```
const lock = new Redlock ();

const cb = (): number => {
  // do some stuff
  return 1;
}

// withLock infers return type from cb
const lockedCb: Promise<number> = lock.withLock('KEY', cb);
```

Example #2 - Asynchronous callback
```
const lock = new Redlock ();

const cb = async (): number => {
  // do some stuff
  return 1;
}

// withLock infers return type from cb
const lockedCb: Promise<number> = lock.withLock('KEY', cb);
```




