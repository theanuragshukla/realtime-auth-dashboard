import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UserEntity } from "../databases/postgres/entity/user.entity";
import Mailer from "../mailer/mailer";
import Redis from "../databases/redis/connection";

import { TOKEN_EXPIRY, EVENT_CHANNEL } from "../constants";
import { CreateMail } from "./types";
import { AnyZodObject } from "zod";

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

export const publishIPBan = (ip: string, uid: string) => {
  const redis = Redis.getInstance();
  const key = `ipban:${ip}:${uid}`;
  redis.rPush(key, "banned");
  redis.publish(EVENT_CHANNEL, key);
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
export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      return res.json({
        status: false,
        msg: "Validation failed",
        data: error,
      });
    }
  };
