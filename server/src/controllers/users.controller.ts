import { Request, Response, Router } from "express";
import { UserEntity } from "../databases/postgres/entity/user.entity";
import { useTypeORM } from "../databases/postgres/typeorm";
import { checkRole } from "../utils/helpers";
import { ROLE } from "../constants";

const controller = Router();

controller
  .use(checkRole([ROLE.ADMIN]))
  .get("/all", async (req: Request, res: Response) => {
    try {
      const page = req.query.page || 1;
      const allUsers = (await useTypeORM(UserEntity)
        .createQueryBuilder("users")
        .select()
        .orderBy("users.createdAt", "DESC")
        .offset((Number(page) - 1) * 20)
        .limit(20)
        .getMany()) as UserEntity[];
      const users = allUsers.map((user) => {
        return {
          uid: user.uid,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      });
      return res.json({
        status: true,
        data: users,
        msg: "All users",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        msg: "Internal Server Error",
      });
    }
  })
  .get("/:uid", async (req: Request, res: Response) => {
    try {
      const uid = req.params.uid;
      const user = await useTypeORM(UserEntity)
        .createQueryBuilder("user")
        .from(UserEntity, "users")
        .select(["users.uid", "users.name", "users.email", "users.role"])
        .where("users.uid = :uid", { uid })
        .getOne();
      return res.json({
        status: true,
        data: user,
        msg: "User details",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        msg: "Internal Server Error",
      });
    }
  })
  .delete("/:uid", async (req: Request, res: Response) => {
    try {
      const uid = req.params.uid;
      await useTypeORM(UserEntity)
        .createQueryBuilder()
        .delete()
        .from(UserEntity, "user")
        .where("users.uid = :uid", { uid })
        .execute();
      return res.json({
        status: true,
        msg: "User deleted",
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
