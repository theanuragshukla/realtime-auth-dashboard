import { Express, Request, Response } from "express";

import authController from "../controllers/auth.controller";
import accountController from "../controllers/account.controller";
import usersController from "../controllers/users.controller";

import { checkIPBan } from "../middlewares/checkIPBan";
import { resolveToken } from "../middlewares/resolveToken";
import { updateSession } from "../middlewares/updateSession";
import { addDeviceId } from "../middlewares/addDeviceId";

const routerSetup = (app: Express) => {
  app
    .use(addDeviceId)
    .use(checkIPBan)
    .get("/", async (_: Request, res: Response) => {
      res.json({ status: true, msg: "Alive!" });
    })
    .use("/auth", authController)
    .use(resolveToken)
    .use(updateSession)
    .use("/account", accountController)
    .use("/users", usersController);
};

export default routerSetup;
