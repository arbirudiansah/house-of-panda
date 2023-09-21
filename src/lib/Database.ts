import Redis, { RedisOptions } from "ioredis";
import mongoose, { Connection, ConnectOptions } from "mongoose"

let cachedDb: Connection | null = null;

const createConnection = async (): Promise<Connection> => {
  if (cachedDb) {
    console.log('👌 Using existing connection');
    return Promise.resolve(cachedDb);
  } else {
    if (!process.env.MONGODB_URI) {
      return Promise.reject("Please set MONGODB_URI env variable");
    }

    console.log('😌 Creating new connection');

    await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      retryWrites: false,
      connectTimeoutMS: 8000,
    } as ConnectOptions)

    cachedDb = mongoose.connection;

    cachedDb
      .once("connected", () => {
        console.log("MongoDB Connected.");
      })
      .on("error", (error) => {
        console.error("Error connecting to DB: ", error.message);
        return Promise.reject("Internal Server Error: Cannot create connection to database!");
      })

    return Promise.resolve(cachedDb);
  }
}

const createRedisConnection = async () => {
  const { host, password, port, db } = {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB,
  }

  try {
    const options: RedisOptions = {
      host,
      port: port ? parseInt(port) : 6379,
      db: db ? parseInt(db) : 0,
      password,
      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 0,
      retryStrategy: (times: number) => {
        if (times > 3) {
          throw new Error(`[Redis] Could not connect after ${times} attempts`);
        }

        return Math.min(times * 200, 1000);
      },
    };

    const redis = new Redis(options);

    redis.on('error', (error: unknown) => {
      console.warn('[Redis] Error connecting', error);
    });

    redis.on('connect', () => {
      console.log('[Redis] Connected');
    });

    return redis;
  } catch (e) {
    throw new Error(`[Redis] Could not create a Redis instance`);
  }
}

export { createConnection, createRedisConnection }

