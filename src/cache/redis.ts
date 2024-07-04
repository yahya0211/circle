import { createClient } from "redis";
import * as dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
  },
});

// pemanggilan koneksi apakah sudah connect atau belum
// jika koneksinya error maka dia akan error

redisClient.on("error", (error) => {
  console.log("Redis client error", error);
  process.exit(1);
});

export default redisClient;

export async function redisConnect() {
  try {
    console.log("Connect to Redis, Ready to use");
  } catch (error) {
    console.log("Redis Client Error:", error);
    process.exit(1);
  }
}

export const DEFAULT_EXPIRATION = 3600;
