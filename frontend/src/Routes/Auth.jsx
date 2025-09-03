import axios from "../axiosConfig/axios";

export const registerUser = (data) => axios.post("/auth/register", data);
export const loginUser = (data) => axios.post("/auth/login", data);
