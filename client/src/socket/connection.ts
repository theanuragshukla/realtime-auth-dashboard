import io from "socket.io-client";

export const connectSocket = ({ uid }: { uid?: string }) => {
  const url = process.env.NEXT_APP_SERVER_BASE_URL || "http://localhost:8000";
  const socket = io(url, {
    withCredentials: true,
    query: {
      forUid: uid,
    },
  });
  return socket;
};
