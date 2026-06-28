import axiosClient from "./axiosClient";

export const registerUser = async (data: never) => {
  const res = await axiosClient.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: never) => {
  const res = await axiosClient.post("/auth/login", data);
  return res.data;
};

export const getMe = async () => {
  const res = await axiosClient.get("/auth/me");
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosClient.post("/auth/logout");
  return res.data;
};
