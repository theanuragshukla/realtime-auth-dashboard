import { Router, Request, Response } from "express";
import { getDataSource, useTypeORM } from "../databases/postgres/typeorm";
import { UserEntity } from "../databases/postgres/entity/user.entity";
import bcrypt from "bcryptjs";
import { ACTIVITY_TYPE, SALT_ROUNDS } from "../constants";
import {
  generateString,
  generateToken,
  getSeed,
  redactEmail,
  setCookie,
  updateSession,
} from "../utils/helpers";
import { UserSessionsEntity } from "../databases/postgres/entity/userSessions.entity";
import { SessionsEntity } from "../databases/postgres/entity/sessions.entity";
import { resolveToken } from "../utils/helpers";
import Redis from "../databases/redis/connection";
import { addActivity } from "../utils/ActivityHelper";

const controller = Router();
const redis = Redis.getInstance();

controller
  .post("/register", async (req: Request, res: Response) => {
    try {
      // TODO: sanitize data
      const {
        email,
        password,
        twofactor,
        name,
        device_details = {},
      } = req.body;

      const userExists = await useTypeORM(UserEntity).findOneBy({ email });
      if (userExists) {
        return res.json({
          status: false,
          msg: "User already exists!",
        });
      }

      const uid = generateString(16);
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = useTypeORM(UserEntity).create({
        email,
        password: hashedPassword,
        twofactor,
        name,
        uid,
      } as UserEntity);

      const seed = getSeed();

      const loginInstance = useTypeORM(UserSessionsEntity).create({
        uid,
        seeds: [seed],
      });

      const getSession = (id: number) =>
        useTypeORM(SessionsEntity).create({
          session_id: id,
          seed,
          device_details,
        });

      await getDataSource().transaction(async (manager) => {
        await manager.getRepository(UserEntity).save(user);
        const sessions = await manager
          .getRepository(UserSessionsEntity)
          .save(loginInstance);
        const session = await manager
          .getRepository(SessionsEntity)
          .save(getSession(sessions.id));
        req.uid = uid;
        req.user = session;
      });
      await addActivity(req, ACTIVITY_TYPE.REGISTER);
      if (twofactor) {
        await addActivity(req, ACTIVITY_TYPE.TFA_INIT);
        const urlParams = {
          id: seed,
          email: redactEmail(user.email),
        };
        const otp = getSeed(6);
        // TODO: send otp on mail
        await redis.hSet(seed, {
          uid: user.uid,
          otp,
          retries: 3,
        });
        redis.expire(seed, 600);
        return res.status(200).json({
          status: true,
          msg: "OTP sent successfully!",
          redirect: `/verify?${new URLSearchParams(urlParams).toString()}`,
        });
      }

      const { token } = generateToken(user as UserEntity, seed);
      setCookie({ res, value: token });
      res.json({
        status: true,
        msg: "User registered successfully!",
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: false,
        msg: "User registration failed!",
      });
    }
  })

  .post("/login", async (req: Request, res: Response) => {
    try {
      // TODO: sanitize data
      const { email, password, device_details = {} } = req.body;
      const user = (await useTypeORM(UserEntity).findOneBy({
        email,
      })) as UserEntity;
      if (!user) {
        return res.json({
          status: false,
          msg: "Invalid email or password!",
        });
      }
      req.uid = user.uid;

      const loginInstance = (await useTypeORM(UserSessionsEntity).findOneBy({
        uid: user.uid,
      })) as UserSessionsEntity;

      const session = (seed?: string) =>
        useTypeORM(SessionsEntity).create({
          session_id: loginInstance.id,
          seed: seed || getSeed(),
          device_details,
          failed_attempts: 0,
        }) as SessionsEntity;

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        let tmpSession = await useTypeORM(SessionsEntity).findOneBy({
          seed: req.deviceId,
        });
        if (tmpSession) {
          useTypeORM(SessionsEntity).increment(
            { seed: req.deviceId },
            "failed_attempts",
            1
          );
        } else {
          tmpSession = await useTypeORM(SessionsEntity).save(
            session(req.deviceId)
          );
        }
        req.user = tmpSession as SessionsEntity;
        await addActivity(req, ACTIVITY_TYPE.LOGIN_FAILED);
        return res.json({
          status: false,
          msg: "Invalid email or password!",
        });
      }

      const seed = getSeed();

      await getDataSource().transaction(async (manager) => {
        const tmpSession = await useTypeORM(SessionsEntity).save(session(seed));
        req.user = tmpSession;
        loginInstance.seeds.push(seed);
        await manager.getRepository(UserSessionsEntity).save(loginInstance);
      });

      await addActivity(req, ACTIVITY_TYPE.LOGIN_SUCCESS);

      if (user.twofactor) {
        await addActivity(req, ACTIVITY_TYPE.TFA_INIT);
        const urlParams = {
          id: seed,
          email: redactEmail(user.email),
        };
        const otp = getSeed(6);
        // TODO: send otp on mail
        await redis.hSet(seed, {
          uid: user.uid,
          otp,
          retries: 3,
        });
        redis.expire(seed, 600);
        return res.status(200).json({
          status: true,
          msg: "OTP sent successfully!",
          redirect: `/verify?${new URLSearchParams(urlParams).toString()}`,
        });
      }
      const { token } = generateToken(user, seed);

      setCookie({ res, value: token });
      res.json({
        status: true,
        msg: "User logged in successfully!",
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: false,
        msg: "User login failed!",
      });
    }
  })
  .post("/verify", async (req: Request, res: Response) => {
    try {
      const { id, otp } = req.body;
      const data = await redis.hGetAll(id);
      if (!data) {
        return res.json({
          status: false,
          msg: "Invalid OTP!",
        });
      }
      const { uid, retries } = data;

      req.uid = uid;
      req.user = useTypeORM(SessionsEntity).create({
        seed: id,
      }) as SessionsEntity;

      if (Number(retries) <= 1) {
        await addActivity(req, ACTIVITY_TYPE.TFA_FAILED);
        return res.json({
          status: false,
          msg: "OTP retries exceeded!",
          redirect: "/login",
        });
      }
      if (data.otp !== otp) {
        await addActivity(req, ACTIVITY_TYPE.TFA_FAILED);
        await redis.hSet(id, {
          retries: Number(retries) - 1,
        });
        return res.json({
          status: false,
          msg: "Invalid OTP!",
        });
      }
      await addActivity(req, ACTIVITY_TYPE.TFA_VERIFIED);
      const user = (await useTypeORM(UserEntity).findOneBy({
        uid,
      })) as UserEntity;
      if (!user) {
        return res.json({
          status: false,
          msg: "User not found!",
        });
      }
      const { token } = generateToken(user, id);
      setCookie({ res, value: token });
      res.json({
        status: true,
        msg: "User logged in successfully!",
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: false,
        msg: "OTP verification failed!",
      });
    }
  })
  .use(resolveToken)
  .use(updateSession)
  .get("/logout", async (req: Request, res: Response) => {
    try {
      const session = req.user;
      session.last_active = new Date();
      session.status = false;
      await useTypeORM(SessionsEntity).save(session);
      await addActivity(req, ACTIVITY_TYPE.LOGOUT);
      res.json({
        status: true,
        msg: "User logged out successfully!",
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: false,
        msg: "User logout failed!",
      });
    }
  });

export default controller;
