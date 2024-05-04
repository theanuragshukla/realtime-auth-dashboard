import { Router, Request, Response } from "express";
import { useTypeORM } from "../databases/postgres/typeorm";
import { SessionsEntity } from "../databases/postgres/entity/sessions.entity";
import { addActivity } from "../utils/ActivityHelper";
import { ACTIVITY_TYPE, ROLE } from "../constants";
import { ActivityEntity } from "../databases/postgres/entity/activity.entity";
import { UserEntity } from "../databases/postgres/entity/user.entity";
import { checkRole, generateToken, setCookie } from "../utils/helpers";

const controller = Router();

controller
  .get("/recent-devices", async (req: Request, res: Response) => {
    try {
      const page = req.query.page || 1;
      const forUid = req.query.forUid;
      const { uid, role, seed } = req.user;
      const allSessions = await useTypeORM(SessionsEntity)
        .createQueryBuilder("sessions")
        .select()
        .where("sessions.uid = :uid", {
          uid: !!forUid ? (role === ROLE.ADMIN ? forUid : uid) : uid,
        })
        .orderBy("sessions.last_active", "DESC")
        .offset((Number(page) - 1) * 5)
        .limit(5)
        .getMany();
      const devices = allSessions.map((session) => {
        return {
          isCurrent: session.seed === seed,
          seed: session.seed,
          last_active: session.last_active,
          device_details: session.device_details,
          status: session.status,
        };
      });
      return res.json({
        status: true,
        data: devices,
        msg: "Recent Devices",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        msg: "Internal Server Error",
      });
    }
  })
  .get(
    "/all-activities",
    checkRole([ROLE.ADMIN]),
    async (req: Request, res: Response) => {
      try {
        const page = req.query.page || 1;
        const allActivities = await useTypeORM(ActivityEntity).find({
          order: { id: "DESC" },
          skip: (Number(page) - 1) * 20,
          take: 20,
        });
        const activities = allActivities.map((activity) => {
          return {
            uid: activity.uid,
            seed: activity.seed,
            action: activity.action,
            timestamp: activity.timestamp,
          };
        });
        return res.json({
          status: true,
          data: activities,
          msg: "All Activities",
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: false,
          msg: "Internal Server Error",
        });
      }
    }
  )
  .get("/recent-activities", async (req: Request, res: Response) => {
    try {
      const page = req.query.page || 1;
      const forUid = req.query.forUid;
      const { uid, role } = req.user;
      const allActivities = await useTypeORM(ActivityEntity).find({
        where: {
          uid: !!forUid ? (role === ROLE.ADMIN ? forUid : uid) : uid,
        },
        order: { id: "DESC" },
        skip: (Number(page) - 1) * 20,
        take: 20,
      });
      const activities = allActivities.map((activity) => {
        return {
          uid: activity.uid,
          seed: activity.seed,
          action: activity.action,
          timestamp: activity.timestamp,
        };
      });
      return res.json({
        status: true,
        data: activities,
        msg: "Recent Activities",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        msg: "Internal Server Error",
      });
    }
  })
  .get("/logout-device/:seed", async (req: Request, res: Response) => {
    try {
      const forUid = req.query.forUid;
      const { uid, role } = req.user;
      const isAdmin = role === ROLE.ADMIN;
      const session = await useTypeORM(SessionsEntity).findOneBy({
        seed: req.params.seed,
        uid: !!forUid ? (isAdmin ? forUid : uid) : uid,
      });
      if (!session) {
        return res.status(404).json({
          status: false,
          msg: "Session not found",
        });
      }
      session.status = false;
      await useTypeORM(SessionsEntity).save(session);
      req.user.uid = isAdmin && !!forUid ? (forUid as string) : uid;
      await addActivity(req, ACTIVITY_TYPE.LOGOUT, session.seed);
      return res.json({
        status: true,
        msg: "Logged out",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        msg: "Internal Server Error",
      });
    }
  })
  .get("/device/:seed", async (req: Request, res: Response) => {
    try {
      const forUid = req.query.forUid;
      const { uid, role } = req.user;
      const session = await useTypeORM(SessionsEntity).findOneBy({
        seed: req.params.seed,
        uid: !!forUid ? (role === ROLE.ADMIN ? forUid : uid) : uid,
      });
      if (!session) {
        return res.status(404).json({
          status: false,
          msg: "Session not found",
        });
      }
      return res.json({
        status: true,
        data: {
          last_active: session.last_active,
          device_details: session.device_details,
          status: session.status,
        },
        msg: "Device Details",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        msg: "Internal Server Error",
      });
    }
  })
  .get("/upgrade", async (req: Request, res: Response) => {
    try {
      const dbUser = await useTypeORM(UserEntity).findOneBy({
        uid: req.user.uid,
      });
      if (!dbUser)
        return res.json({
          status: false,
          msg: "Unauthorised",
        });
      dbUser.role = ROLE.ADMIN;
      await useTypeORM(UserEntity).save(dbUser);
      const { token } = generateToken(dbUser as UserEntity, req.user.seed);
      setCookie({ value: token, res });
      res.json({
        status: true,
        msg: "Account upgraded",
      });
    } catch (e: any) {
      res.json({
        status: false,
        msg: "Upgrade failed",
      });
    }
  });

export default controller;
