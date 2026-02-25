import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // always send cookies
});

export default axiosClient;
