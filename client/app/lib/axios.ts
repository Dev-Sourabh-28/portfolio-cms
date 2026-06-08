import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window === "undefined"
    ? "https://portfolio-cms-1-dsxl.onrender.com"
    : `${window.location.protocol}//${window.location.hostname}:5000`);

const API = axios.create({ baseURL, withCredentials: true });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

export default API;