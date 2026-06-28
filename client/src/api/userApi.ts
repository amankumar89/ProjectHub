import axiosClient from "./axiosClient";

// GET all users
export const getAllUsers = async () => {
  const res = await axiosClient.get("/users");
  return res.data;
};

// GET user by ID
export const getUserById = async (id: string) => {
  const res = await axiosClient.get(`/users/${id}`);
  return res.data;
};

// UPDATE user
export const updateUser = async (id: string, data: any) => {
  const res = await axiosClient.put(`/users/updateUser/${id}`, data);
  return res.data;
};

// DELETE user
export const deleteUserById = async (id: string) => {
  const res = await axiosClient.delete(`/users/deleteUserById/${id}`);
  return res.data;
};
