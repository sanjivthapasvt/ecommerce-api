import Redis from "ioredis";
import { config } from "./environmentVariables";

export const redis = new Redis(config.redis.url)