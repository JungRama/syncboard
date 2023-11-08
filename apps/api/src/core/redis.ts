import { createClient } from "redis";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "~/env.config";

// Create a Redis client
const redisClient = createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

/**
 * Connects to the Redis server.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 */
const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error((error as Error).message);
    setInterval(connectRedis, 5000);
  }
};

// Connect to the Redis server
connectRedis();

// Log a success message when the client connects
redisClient.on("connect", () =>
  console.log("Redis client connected successfully")
);

// Log an error message when an error occurs
redisClient.on("error", (err) => console.error(err));

export default redisClient;
