import { Request, Response, NextFunction } from "express";

export const allowCors = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    process.env.CLIENT_URL || "http://localhost:3000",
    "http://localhost:3000",
  ];

  const origin = req.headers.origin;

  if (!!origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        req.headers["access-control-request-headers"] || ""
      );
      return res.status(200).end();
    }
  } else {
    res.header("Access-Control-Allow-Origin", allowedOrigins[0]);
  }

  next();
};
