import axios from "axios";

export const getClient = () => {
  const baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:8000";
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};
