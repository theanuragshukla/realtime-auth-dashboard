import io from "socket.io-client";

export const connectSocket = () => {
  const url = process.env.REACT_APP_SOCKET_URL || "http://localhost:8000";
  const socket = io(url, {
    withCredentials: true,
  });
  return socket
};
