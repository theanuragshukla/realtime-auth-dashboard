import { Request } from "express";
import { ACTIVITY_TYPE, EVENT_CHANNEL } from "../constants";
import { useTypeORM } from "../databases/postgres/typeorm";
import { ActivityEntity } from "../databases/postgres/entity/activity.entity";
import { SessionsEntity } from "../databases/postgres/entity/sessions.entity";
import Redis from "../databases/redis/connection";

const redis = Redis.getInstance();

export const addActivity = async (req: Request, action: ACTIVITY_TYPE, customSeed?:string) => {
  try {
    const seed = customSeed || req.user?.seed;
    if (!seed) {
      console.log("Seed not found");
      return false;
    }
    const activity = useTypeORM(ActivityEntity).create({
      uid: req.uid,
      seed: seed,
      action,
    });
    await useTypeORM(ActivityEntity).save(activity);
    redis.publish(EVENT_CHANNEL, JSON.stringify(activity));
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const addAnonymousActivity = async (
  req: Request,
  action: ACTIVITY_TYPE
) => {
  const deviceId = req.deviceId;
  req.user = useTypeORM(SessionsEntity).create({
    seed: deviceId,
  }) as SessionsEntity;
  await addActivity(req, action);
};

