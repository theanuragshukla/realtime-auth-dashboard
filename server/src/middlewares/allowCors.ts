import { Request, Response, NextFunction } from "express";

export const allowCors = (req: Request, res: Response, next: NextFunction) => {
  const allowed_origins = [
    process.env.CLIENT_URL || "http://localhost:3000",
    "http://localhost:3000",
  ];

  if (allowed_origins.includes(req.headers.origin || "")) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  }
};
