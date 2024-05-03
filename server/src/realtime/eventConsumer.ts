import { EVENT_CHANNEL } from "../constants";
import { ActivityEntity } from "../databases/postgres/entity/activity.entity";
import Redis from "../databases/redis/connection";
const redis = Redis.newClient();

const eventConsumer = async (io: any) => {
  await redis.subscribe(EVENT_CHANNEL, (msg) => {
    const data = JSON.parse(msg) as ActivityEntity;
    io.to(["admin", data.uid]).emit("event", {
      seed: data.seed,
      action: data.action,
      timestamp: data.timestamp,
    });
  });
};

export default eventConsumer;
