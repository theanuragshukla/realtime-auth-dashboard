import { Request, Response, NextFunction } from "express";
import Redis from "../databases/redis/connection";

export const checkIPBan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const redis = Redis.getInstance();
  const { deviceId } = req;
  if (!deviceId) return res.json({ status: false, msg: "Unauthorized" });
  if (await redis.get(deviceId))
    return res.json({ status: false, msg: "IP Banned" });
  next();
};
