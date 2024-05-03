import express from "express";
import dotenv from "dotenv";
const app = express();
import appSetup from "./startup/init";
import routerSetup from "./startup/router";
import securitySetup from "./startup/security";
import SocketIO from "./realtime/setup";
import eventConsumer from "./realtime/eventConsumer";

dotenv.config();

const init = async () => {
  securitySetup(app, express);
  const server = await appSetup(app);
  const io = SocketIO.getInstance(server)
  eventConsumer(io)
  routerSetup(app);
};

init()
