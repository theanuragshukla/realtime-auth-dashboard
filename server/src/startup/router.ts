import { Express, Request, Response } from "express";

const routerSetup = (app: Express) =>
  app.get("/", async (req: Request, res: Response) => {
    res.send("Hello World!");
  });

export default routerSetup;
