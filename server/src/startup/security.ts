import cookieParser from "cookie-parser";
import cors from "cors";
import { Express } from "express";
import { allowCors } from "../middlewares/allowCors";

const securitySetup = (app: Express, express: any) =>
  app
    .use(
      cors({
        origin: [
          "http://localhost:3000",
          process.env.CLIENT_URL || "http://localhost:3000",
        ],
        credentials: true,
      })
    )
    .use(allowCors)
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser());

export default securitySetup;
