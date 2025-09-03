import axios from "axios";

// Create an Axios instance
const axiosConfig = axios.create({
  baseURL: "http://localhost:3000/api", // fallback to local
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies if backend uses them
});

export default axiosConfig