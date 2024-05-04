import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { useTypeORM } from "../databases/postgres/typeorm";
import { SessionsEntity } from "../databases/postgres/entity/sessions.entity";

import { UserSession } from "../utils/types";
import { JWT_PAYLOAD } from "../constants";

export const resolveToken= async (
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
