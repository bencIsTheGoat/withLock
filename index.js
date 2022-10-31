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
class RedLock {
    constructor({ clientOptions, redisClient, delay, timeout } = {}) {
        if (clientOptions) {
            this.redisClient = new ioredis_1.default(clientOptions);
        }
        else if (redisClient) {
            this.redisClient = redisClient;
        }
        else {
            this.redisClient = new ioredis_1.default();
        }
        this.delay = delay || RedLock.DEFAULT_DELAY;
        this.timeout = timeout || RedLock.DEFAULT_TIMEOUT;
    }
    withLock(key, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            let ok = yield this.redisClient.set(key, 1, 'PX', this.timeout, 'NX');
            while (!ok) {
                yield new Promise((res) => setTimeout(res, this.delay));
                ok = yield this.redisClient.set(key, 1, 'PX', this.timeout, 'NX');
            }
            return yield cb();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.redisClient.disconnect();
        });
    }
}
RedLock.DEFAULT_DELAY = 50;
RedLock.DEFAULT_TIMEOUT = 5000;
exports.default = RedLock;
