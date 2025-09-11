import axios from "axios";

// Create an Axios instance
const axiosConfig = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});;

export default axiosConfig