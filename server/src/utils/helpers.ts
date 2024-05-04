import jwt from "jsonwebtoken";
import { UserEntity } from "../databases/postgres/entity/user.entity";
import { TOKEN_EXPIRY, JWT_PAYLOAD, EVENT_CHANNEL } from "../constants";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { useTypeORM } from "../databases/postgres/typeorm";
import { SessionsEntity } from "../databases/postgres/entity/sessions.entity";
import { CreateMail, UserSession } from "./types";
import Mailer from "../mailer/mailer";
import Redis from "../databases/redis/connection";

export const setCookie = ({
  name,
  value,
  res,
}: {
  name?: string;
  value: string;
  res: Response;
}) => {
  res.setHeader(
    "set-cookie",
    `${
      name || "token"
    }=${value}; HttpOnly; SameSite=None; Secure; Path=/; ExpiresIn=${TOKEN_EXPIRY};`
  );
};
export const publishMail = (schema: CreateMail) => {
  const redis = Redis.getInstance();
  const key = `mail:${schema.to}:${schema.action}`;
  redis.rPush(key, JSON.stringify(schema));
  redis.publish(EVENT_CHANNEL, key);
};
export const sendOTP = (email: string, otp: string) => {
  Mailer.sendMail(email, "2 step verification OTP", `<h1>OTP: ${otp}</h1>`);
};

export const redactEmail = (email: string) => {
  const [username, domain] = email.split("@");
  const redacted = `${username.slice(0, 2)}****@${domain}`;
  return redacted;
};

export const getSeed = (len = 16) => generateString(len);

export const generateString = (len = 16) => {
  if (typeof len !== "number" || len <= 0)
    throw new Error("Invalid string length");
  const space =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let str = "";
  for (let i = 0; i < len; i++) {
    str += space.charAt(Math.floor(Math.random() * space.length));
  }
  return str;
};

export const generateToken = (user: UserEntity, seed?: string) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  if (!seed) seed = getSeed();
  const token = jwt.sign({ uid: user.uid, role: user.role, seed }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
  return { seed, token };
};

export const resolveToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies;
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    const decoded = jwt.verify(token, JWT_SECRET) as JWT_PAYLOAD;
    const session = (await useTypeORM(SessionsEntity).findOneBy({
      uid: decoded.uid,
      seed: decoded.seed,
    })) as UserSession;
    if (!session || !session.status) {
      throw new Error("Unauthorized");
    }
    session.role = decoded.role;
    req.user = session as UserSession;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: false,
      msg: "Unauthorized",
    });
  }
};

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

export const updateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = req.user;
    if (!session) {
      throw new Error("Unauthorized");
    }
    session.last_active = new Date();
    await useTypeORM(SessionsEntity).save(session);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ status: false, msg: "Unauthorized" });
  }
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role && roles.includes(req.user.role)) next();
    else
      return res.json({
        status: false,
        msg: "Insufficient permissions",
        redirect: "/dashboard",
      });
  };
};
