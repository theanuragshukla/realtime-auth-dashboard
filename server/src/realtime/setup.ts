import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { JWT_PAYLOAD, ROLE } from "../constants";

class SocketServer {
  io: Server;
  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });
    this.io.use((socket: Socket, next) => {
      try {
        const cookies = socket.handshake.headers.cookie?.split("; ");
        const token = cookies
          ?.find((cookie) => cookie.startsWith("token="))
          ?.split("=")[1];
        if (!token) throw new Error("No token provided");
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || ""
        ) as JWT_PAYLOAD;
        socket.user = decoded;
        next();
      } catch (error) {
        console.log("Unauthorized connection");
        return socket.disconnect();
      }
    });
    this.io.on("connection", (socket) => {
      console.log(`${socket.user.uid} connected`);
      socket.join(socket.user.uid);
      if(socket.user.role===ROLE.ADMIN) socket.join("admin")
      this.io
        .to(socket.user.uid)
        .emit("system", "Connected to Realtime Server");
    });
  }
}

class SocketIO {
  private static instance: SocketServer;

  constructor(server: any) {
    if (!SocketIO.instance) {
      SocketIO.instance = new SocketServer(server);
    }
  }

  public static getInstance(server: any) {
    if (!SocketIO.instance) SocketIO.instance = new SocketServer(server);
    return SocketIO.instance.io;
  }
}

export default SocketIO;
