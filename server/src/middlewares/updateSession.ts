import { Request, Response, NextFunction } from "express";

import { useTypeORM } from "../databases/postgres/typeorm";
import { SessionsEntity } from "../databases/postgres/entity/sessions.entity";

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
