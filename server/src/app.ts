import express from "express";
import dotenv from "dotenv";
const app = express();
import appSetup from "./startup/init";
import routerSetup from "./startup/router";
import securitySetup from "./startup/security";

dotenv.config()
appSetup(app);
securitySetup(app, express);
routerSetup(app);
