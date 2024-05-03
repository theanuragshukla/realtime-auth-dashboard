import { Express, Request, Response } from "express";
import authController from "../controllers/auth.controller";
import accountController from "../controllers/account.controller";
import { addDeviceId, resolveToken, updateSession } from "../utils/helpers";

const routerSetup = (app: Express) => {
  app
    .use(addDeviceId)
    .get("/", async (_: Request, res: Response) => {
      res.json({ status: true, msg: "Alive!" });
    })
    .use("/auth", authController)
    .use(resolveToken)
    .use(updateSession)
    .use('/account', accountController)
};

export default routerSetup;
