//here we will create an instance through which we can use it throughout our application
import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, //we want to send cookies in every single request
});
