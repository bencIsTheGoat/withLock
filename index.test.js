"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redis_memory_server_1 = __importDefault(require("redis-memory-server"));
const _1 = __importDefault(require("."));
let host;
let port;
let redisServer;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    redisServer = new redis_memory_server_1.default();
    host = yield redisServer.getHost();
    port = yield redisServer.getPort();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    if (redisServer) {
        yield redisServer.stop();
    }
}));
it('should setup default ioredis client correctly with no clientOptions', () => __awaiter(void 0, void 0, void 0, function* () {
    const lock = new _1.default();
    const key = Math.random().toString();
    const value = Math.random();
    yield expect(lock.redisClient.set(key, value)).resolves.toEqual('OK');
    yield lock.redisClient.disconnect();
}));
it('should setup default ioredis client correctly with clientOptions', () => __awaiter(void 0, void 0, void 0, function* () {
    const lock = new _1.default({ clientOptions: { port, host } });
    const key = Math.random().toString();
    const value = Math.random();
    yield expect(lock.redisClient.set(key, value)).resolves.toEqual('OK');
    yield lock.redisClient.disconnect();
}));
it('should setup ioredis client correctly', () => __awaiter(void 0, void 0, void 0, function* () {
    const redisClient = new ioredis_1.default({ host, port });
    const lock = new _1.default({ redisClient });
    const key = Math.random().toString();
    const value = Math.random();
    yield expect(lock.redisClient.set(key, value)).resolves.toEqual('OK');
    yield lock.redisClient.disconnect();
}));
it('should ensure synchronous callback returns correct value', () => __awaiter(void 0, void 0, void 0, function* () {
    const lock = new _1.default({ clientOptions: { port, host } });
    const cb = () => 1;
    const key = Math.random().toString();
    yield expect(lock.withLock(key, cb)).resolves.toEqual(1);
    yield lock.redisClient.disconnect();
}));
it('should ensure asynchronous callback returns correct value', () => __awaiter(void 0, void 0, void 0, function* () {
    const lock = new _1.default({ clientOptions: { port, host } });
    const cb = () => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((res) => setTimeout(res, 100));
        return 1;
    });
    const key = Math.random().toString();
    yield expect(lock.withLock(key, cb)).resolves.toEqual(1);
    yield lock.redisClient.disconnect();
}));
