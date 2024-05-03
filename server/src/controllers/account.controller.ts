import { Router, Request, Response } from "express";
import { useTypeORM } from "../databases/postgres/typeorm";
import { SessionsEntity } from "../databases/postgres/entity/sessions.entity";
import { addActivity } from "../utils/ActivityHelper";
import { ACTIVITY_TYPE } from "../constants";
import { ActivityEntity } from "../databases/postgres/entity/activity.entity";

const controller = Router();

controller
  .get("/recent-devices", async (req: Request, res: Response) => {
    try {
      const page = req.query.page || 1;
      const { user } = req;
      const allSessions = await useTypeORM(SessionsEntity).find({
        where: { session_id: user.session_id },
        order: { last_active: "DESC" },
        skip: (Number(page) - 1) * 5,
        take: 5,
      });
      const devices = allSessions.map((session) => {
        return {
          isCurrent: session.seed === user.seed,
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
  .get("/recent-activities", async (req: Request, res: Response) => {
    try {
      const page = req.query.page || 1;
      const allActivities = await useTypeORM(ActivityEntity).find({
        where: { uid: req.uid },
        order: { timestamp: "DESC" },
        skip: (Number(page) - 1) * 20,
        take: 20,
      });
      const activities = allActivities.map((activity) => {
        return {
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
      const { user } = req;
      const session = await useTypeORM(SessionsEntity).findOneBy({
        seed: req.params.seed,
        session_id: user.session_id,
      });
      if (!session) {
        return res.status(404).json({
          status: false,
          msg: "Session not found",
        });
      }
      session.status = false;
      await useTypeORM(SessionsEntity).save(session);
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
      const { user } = req;
      const session = await useTypeORM(SessionsEntity).findOneBy({
        seed: req.params.seed,
        session_id: user.session_id,
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
  });

export default controller;
