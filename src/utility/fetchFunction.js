import axios from "axios";
import useUserStore from "../store/useUserStore";

const baseURL = import.meta.env.VITE_API_BASE_URL;
// const baseURL = "https://smashbe.onrender.com/api/";

console.log("Base URL:", baseURL); // Check the browser console for this log
const publicFetch = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const privateFetch = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

privateFetch.interceptors.request.use((config) => {
  console.log("Interceptor running");
  const token = useUserStore.getState().user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { publicFetch, privateFetch };
