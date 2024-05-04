import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { JWT_PAYLOAD, ROLE } from "../constants";

class SocketServer {
  private static instance: SocketServer;
  io: Server;

  private constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });
    this.setupSocketIO();
  }

  private setupSocketIO() {
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
      const forUid = socket.handshake.query.forUid
      const isAdmin = socket.user.role === ROLE.ADMIN
      console.log(`${socket.user.uid} connected`);
      if (isAdmin && !!forUid) socket.join(forUid);
      else socket.join(socket.user.uid)
      socket.emit("system", "Connected to Realtime Server");
      socket.on("disconnect", () => {
        console.log(`${socket.user.uid} disconnected`);
      });
    });
  }

  public static getInstance(server: any): SocketServer {
    if (!SocketServer.instance) {
      SocketServer.instance = new SocketServer(server);
    }
    return SocketServer.instance;
  }
}

class SocketIO {
  public static getInstance(server: any) {
    return SocketServer.getInstance(server).io;
  }
}

export default SocketIO;
