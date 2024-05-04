import { Request, Response, NextFunction } from "express";

import { generateString, setCookie } from "../utils/helpers";

export const addDeviceId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies.deviceId) {
    req.deviceId = req.cookies.deviceId;
    return next();
  }
  const deviceId = generateString(16);
  req.deviceId = deviceId;
  setCookie({ name: "deviceId", value: deviceId, res });
  next();
};
